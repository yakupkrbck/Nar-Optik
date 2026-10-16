import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageCircle, Send, Check } from 'lucide-react';

export const BoutiqueContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    boutique: 'Nişantaşı Butiği',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', boutique: 'Nişantaşı Butiği', notes: '' });
    }, 4000);
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      'Merhaba Nar Optik, vitrin modellerinizi inceledim. Butiklerinizde denemek ve optisyen danışmanlığı almak istiyorum.'
    );
    window.open(`https://wa.me/905321234567?text=${text}`, '_blank');
  };

  const boutiques = [
    {
      name: 'Nişantaşı Amiral Butik',
      address: 'Abdi İpekçi Caddesi No: 42/B, Şişli / İstanbul',
      phone: '+90 (212) 296 40 10',
      hours: 'Pzt - Cmt: 10:00 - 20:00 · Paz: 12:00 - 18:00',
    },
    {
      name: 'Bağdat Caddesi Butik',
      address: 'Bağdat Caddesi No: 310/A, Kadıköy / İstanbul',
      phone: '+90 (216) 385 12 30',
      hours: 'Pzt - Cmt: 10:00 - 20:00 · Paz: 12:00 - 19:00',
    },
    {
      name: 'Kanyon AVM Butik',
      address: 'Büyükdere Cad. No: 185 Kanyon Kat -1, Levent / İstanbul',
      phone: '+90 (212) 353 50 20',
      hours: 'Hergün: 10:00 - 22:00',
    },
  ];

  return (
    <section id="butikler" className="py-16 bg-[#f4f2ec] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Boutiques Information */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Fiziksel Deneyim & Butiklerimiz
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Nar Optik Butiklerinde Ayrıcalıklı Deneyim
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                Koleksiyonumuzdaki tüm modelleri mağazalarımızda deneyebilir; yüz analizi, reçete ölçümü ve milimetrik odaklama cihazlarımızla optisyenlerimizden ücretsiz kişisel danışmanlık alabilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {boutiques.map((b) => (
                <div key={b.name} className="p-4 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
                  <div className="font-semibold text-stone-900">{b.name}</div>
                  <div className="text-stone-500 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>
                  <div className="text-stone-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-mono">{b.phone}</span>
                  </div>
                  <div className="text-stone-400 text-[11px] flex items-center gap-1.5 pt-1 border-t border-stone-100">
                    <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{b.hours}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleDirectWhatsApp}
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Optisyen Danışma Hattı ile İletişime Geç</span>
              </button>
            </div>
          </div>

          {/* Right Column: Appointment Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              Butikte Model İnceleme & Randevu Talebi
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              İncelemek istediğiniz modelleri sizin için ayıralım ve randevunuzu oluşturalım.
            </p>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong>Talebiniz Kaydedildi!</strong> Uzman optisyenimiz{' '}
                  {formData.name} adına {formData.boutique} için sizinle en kısa sürede telefonla irtibata geçecektir.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Adınız Soyadınız
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Telefon Numaranız
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Ziyaret Etmek İstediğiniz Butik
                  </label>
                  <select
                    value={formData.boutique}
                    onChange={(e) => setFormData({ ...formData, boutique: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="Nişantaşı Butiği">Nişantaşı Butiği</option>
                    <option value="Bağdat Caddesi Butiği">Bağdat Caddesi Butiği</option>
                    <option value="Kanyon AVM Butiği">Kanyon AVM Butiği</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    İlgilendiğiniz Modeller veya Notlar
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Örn: Nar Cortina Havana ve Nar Kyoto modellerini denemek istiyorum."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Randevu ve Model Ayırma Talebini İlet</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
