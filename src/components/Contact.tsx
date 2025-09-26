'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    treatment: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="contact">
      <h2 className="section-title text-center">#KONTAK</h2>
      <div className="contact-content">
        <div className="contact-info">
          <h3>DRW Prime Yogyakarta</h3>
          <p>Jl. Affandi No. 123<br/>Sleman, Yogyakarta 55281</p>
          <p>WhatsApp: +62 812-3456-7890<br/>Email: hello@drwprime.com</p>
          <div className="contact-socials">
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">TikTok</a>
            <a href="#" className="social-link">WhatsApp</a>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="contact-form" suppressHydrationWarning>
          <input
            type="text"
            name="name"
            placeholder="NAMA LENGKAP"
            value={formData.name}
            onChange={handleChange}
            required
            suppressHydrationWarning
            className="w-full p-4 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-gold-primary focus:outline-none transition-colors"
          />
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={formData.email}
            onChange={handleChange}
            required
            suppressHydrationWarning
            className="w-full p-4 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-gold-primary focus:outline-none transition-colors"
          />
          <input
            type="tel"
            name="phone"
            placeholder="NOMOR TELEPON"
            value={formData.phone}
            onChange={handleChange}
            required
            suppressHydrationWarning
            className="w-full p-4 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-gold-primary focus:outline-none transition-colors"
          />
          <select
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            required
            suppressHydrationWarning
            className="w-full p-4 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-gold-primary focus:outline-none transition-colors"
          >
            <option value="" disabled>PILIH TREATMENT</option>
            <option value="Ultra Former MPT">Ultra Former MPT</option>
            <option value="Oxy Treatment">Oxy Treatment</option>
            <option value="Prime Facial">Prime Facial</option>
            <option value="Contouring Treatment">Contouring Treatment</option>
          </select>
          <textarea
            name="message"
            placeholder="PESAN ANDA"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            suppressHydrationWarning
            className="w-full p-4 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-gold-primary focus:outline-none transition-colors resize-none"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gold-primary to-gold-secondary text-black py-4 rounded-lg font-semibold tracking-wide hover:shadow-lg hover:shadow-gold-primary/25 transition-all duration-300"
          >
            KIRIM PESAN
          </button>
        </form>
      </div>
    </section>
  );
}
