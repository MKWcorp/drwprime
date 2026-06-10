#!/usr/bin/env python3
"""Create daily spending tables for front-office membership reports.

This script is idempotent:
- Creates tables if they do not exist
- Creates indexes/constraints if they do not exist
- Prints a final verification summary
"""

from __future__ import annotations

import os
import sys
from typing import Iterable, Tuple

import psycopg2
from psycopg2 import sql


def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set in environment")
    return database_url


def run_statements(cursor, statements: Iterable[str]) -> None:
    for statement in statements:
        cursor.execute(statement)


def table_exists(cursor, table_name: str) -> bool:
    cursor.execute(
        """
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = %s
        )
        """,
        (table_name,),
    )
    return bool(cursor.fetchone()[0])


def count_rows(cursor, table_name: str) -> int:
    cursor.execute(sql.SQL("SELECT COUNT(*) FROM {};").format(sql.Identifier(table_name)))
    return int(cursor.fetchone()[0])


def main() -> int:
    try:
        database_url = get_database_url()
    except RuntimeError as exc:
        print(f"ERROR: {exc}")
        return 1

    ddl_statements = [
        """
        CREATE TABLE IF NOT EXISTS public.daily_spending_uploads (
                    id TEXT PRIMARY KEY,
                    "reportDate" TIMESTAMP(3) NOT NULL,
                    "sourceFileName" TEXT NOT NULL,
                    "uploadedByClerkId" TEXT NULL,
                    "totalRows" INTEGER NOT NULL DEFAULT 0,
                    "totalPendapatan" NUMERIC(14,2) NOT NULL DEFAULT 0,
                    "totalKeuntungan" NUMERIC(14,2) NOT NULL DEFAULT 0,
                    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS public.daily_spending_entries (
          id TEXT PRIMARY KEY,
                    "uploadId" TEXT NOT NULL,
                    "nomorInvoice" TEXT NOT NULL,
                    "nomorRegistrasi" TEXT NULL,
                    "namaPasien" TEXT NOT NULL,
          dob TEXT NULL,
                    "tanggalKunjungan" TIMESTAMP(3) NOT NULL,
          dokter TEXT NULL,
          diagnosa TEXT NULL,
          status TEXT NULL,
                    "totalPendapatan" NUMERIC(14,2) NOT NULL DEFAULT 0,
                    "pendapatanTindakan" NUMERIC(14,2) NOT NULL DEFAULT 0,
                    "pendapatanObat" NUMERIC(14,2) NOT NULL DEFAULT 0,
          keuntungan NUMERIC(14,2) NOT NULL DEFAULT 0,
                    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT daily_spending_entries_upload_id_fkey
                        FOREIGN KEY ("uploadId")
            REFERENCES public.daily_spending_uploads(id)
            ON DELETE CASCADE
        );
        """,
        """
        CREATE UNIQUE INDEX IF NOT EXISTS daily_spending_entries_upload_id_nomor_invoice_key
                    ON public.daily_spending_entries("uploadId", "nomorInvoice");
        """,
        """
        CREATE INDEX IF NOT EXISTS daily_spending_entries_tanggal_kunjungan_idx
                    ON public.daily_spending_entries("tanggalKunjungan");
        """,
        """
        CREATE INDEX IF NOT EXISTS daily_spending_entries_nama_pasien_idx
                    ON public.daily_spending_entries("namaPasien");
        """,
        """
        CREATE INDEX IF NOT EXISTS daily_spending_uploads_report_date_idx
                    ON public.daily_spending_uploads("reportDate");
        """,
    ]

    conn = None
    try:
        conn = psycopg2.connect(database_url)
        conn.autocommit = False

        with conn.cursor() as cursor:
            run_statements(cursor, ddl_statements)
            conn.commit()

            tables: Tuple[str, ...] = (
                "daily_spending_uploads",
                "daily_spending_entries",
            )

            print("=== Verification ===")
            for table in tables:
                exists = table_exists(cursor, table)
                row_count = count_rows(cursor, table) if exists else 0
                print(f"table={table} exists={exists} rows={row_count}")

        print("SUCCESS: daily spending tables are ready.")
        return 0

    except Exception as exc:  # noqa: BLE001
        if conn:
            conn.rollback()
        print(f"ERROR: failed to create/verify tables: {exc}")
        return 1
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    sys.exit(main())
