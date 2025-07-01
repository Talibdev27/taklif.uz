import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { uz, ru, enUS } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PhotoUpload } from '@/components/photo-upload';
import { EpicRSVPForm } from '@/components/epic-rsvp-form';
import { GuestBookForm } from '@/components/guest-book-form';
import { EnhancedSocialShare } from '@/components/enhanced-social-share';
import { MapPin, Heart, MessageSquare, Calendar, Music, Clock, Camera, Users } from 'lucide-react';
import { calculateWeddingCountdown } from '@/lib/utils';
import type { Wedding, Photo, GuestBookEntry } from '@shared/schema';

interface EpicTemplateProps {
  wedding: Wedding;
}

export function EpicTemplate({ wedding }: EpicTemplateProps) {
  const { t, i18n } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Force language based on wedding settings
  useEffect(() => {
    if (wedding?.defaultLanguage && i18n.language !== wedding.defaultLanguage) {
      console.log('Epic template: Setting language to', wedding.defaultLanguage);
      i18n.changeLanguage(wedding.defaultLanguage);
    }
  }, [wedding?.defaultLanguage, i18n]);

  // Get the appropriate locale for date formatting
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'uz': return uz;
      case 'ru': return ru;
      default: return enUS;
    }
  };

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ['/api/photos/wedding', wedding?.id],
    queryFn: () => fetch(`/api/photos/wedding/${wedding?.id}`).then(res => res.json()),
    enabled: !!wedding?.id,
  });

  const { data: guestBookEntries = [] } = useQuery<GuestBookEntry[]>({
    queryKey: ['/api/guest-book/wedding', wedding?.id],
    queryFn: () => fetch(`/api/guest-book/wedding/${wedding?.id}`).then(res => res.json()),
    enabled: !!wedding?.id,
  });

  // Timezone-aware countdown calculation
  useEffect(() => {
    if (!wedding?.weddingDate) return;
    
    const calculateTimeLeft = () => {
      const result = calculateWeddingCountdown(
        wedding.weddingDate,
        wedding.weddingTime || '16:00',
        wedding.timezone || 'Asia/Tashkent'
      );
      
      setTimeLeft(result);
    };

    calculateTimeLeft();
    // Update every second for real-time countdown
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [wedding?.weddingDate, wedding?.weddingTime, wedding?.timezone]);

  if (!wedding) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const primaryColor = wedding?.primaryColor || '#1976d2';
  const accentColor = wedding?.accentColor || '#1565c0';

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center space-x-1 md:space-x-2">
              <Heart className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
              <span className="font-playfair font-semibold text-lg md:text-xl text-gray-800">
                {wedding?.bride?.split(' ')[0] || 'Wedding'} & {wedding?.groom?.split(' ')[0] || 'Day'}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {[
                { href: '#home', label: t('nav.home') },
                { href: '#rsvp', label: t('nav.rsvp') },
                { href: '#details', label: t('nav.details') },
                { href: '#gallery', label: t('nav.gallery') },
                { href: '#guestbook', label: t('nav.guestbook') }
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href.substring(1))}
                  className="text-sm font-medium transition-colors hover:text-gray-600"
                  style={{ color: primaryColor }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg"
              style={{ color: primaryColor }}
              onClick={() => {
                // Simple mobile menu toggle - you can enhance this
                const menu = document.getElementById('mobile-menu');
                if (menu) {
                  menu.classList.toggle('hidden');
                }
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          <div id="mobile-menu" className="hidden md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {[
                { href: '#home', label: t('nav.home') },
                { href: '#rsvp', label: t('nav.rsvp') },
                { href: '#details', label: t('nav.details') },
                { href: '#gallery', label: t('nav.gallery') },
                { href: '#guestbook', label: t('nav.guestbook') }
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    scrollToSection(item.href.substring(1));
                    // Close mobile menu after click
                    const menu = document.getElementById('mobile-menu');
                    if (menu) menu.classList.add('hidden');
                  }}
                  className="text-left px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 rounded-lg"
                  style={{ color: primaryColor }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: wedding?.couplePhotoUrl 
            ? `url(${wedding.couplePhotoUrl})` 
            : `url('/api/placeholder/1920/1080')`
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 text-center text-white px-4 md:px-6 max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold mb-4 md:mb-6 leading-tight"
              style={{ 
                color: primaryColor,
                background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {wedding?.bride || 'Bride'} & {wedding?.groom || 'Groom'}
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-gray-100 mb-4 md:mb-6 italic font-light">
              {wedding?.weddingDate ? format(new Date(wedding.weddingDate), 'd MMMM yyyy', { locale: getDateLocale() }) : t('details.dateTBD')}
            </p>

            <div className="flex items-center justify-center mb-6 md:mb-8 text-gray-100">
              <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-sm md:text-base">{wedding?.weddingTime || '4:00 PM'}</span>
            </div>
          </div>

            {/* Countdown */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 max-w-sm md:max-w-md lg:max-w-lg mx-auto">
              {[
                { value: timeLeft.days, label: t('countdown.days') },
                { value: timeLeft.hours, label: t('countdown.hours') },
                { value: timeLeft.minutes, label: t('countdown.minutes') }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="rounded-[12px] md:rounded-[15px] p-3 md:p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden aspect-square flex flex-col items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-[12px] md:rounded-[15px]"></div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white relative z-10 leading-none">{item.value}</div>
                  <div className="text-[10px] md:text-xs text-white/90 uppercase tracking-wider font-medium mt-1 md:mt-2 relative z-10 text-center leading-tight">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div 
              onClick={() => {
                const mapUrl = wedding?.mapPinUrl || wedding?.venueAddress;
                if (mapUrl) {
                  // If it's already a full URL, open it directly
                  if (mapUrl.startsWith('http')) {
                    window.open(mapUrl, '_blank');
                  } else {
                    // Otherwise, create a Google Maps search URL
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapUrl)}`, '_blank');
                  }
                }
              }}
              className="inline-block text-white px-4 md:px-6 py-2 md:py-3 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 cursor-pointer text-sm md:text-base"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <MapPin className="inline w-4 h-4 mr-2" />
              {wedding?.venue || t('wedding.venue')}
            </div>
        </div>
      </section>

      {/* Dear Guests Section */}
      <section 
        className="py-16 md:py-20"
        style={{ background: `linear-gradient(135deg, ${primaryColor}08, ${accentColor}08)` }}
      >
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-6 md:mb-8 text-gray-800">{t('sections.dearGuests')}</h2>
          
          {wedding?.dearGuestMessage && (
            <div className="max-w-3xl mx-auto">
              <div 
                className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border"
                style={{ borderColor: `${primaryColor}20` }}
              >
                <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                  {wedding.dearGuestMessage}
                </p>
                <div className="mt-4 md:mt-6 text-right">
                  <p className="font-medium text-sm md:text-base" style={{ color: primaryColor }}>
                    {wedding?.bride} & {wedding?.groom}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RSVP Section */}
      <section 
        id="rsvp" 
        className="py-16 md:py-20"
        style={{ background: `linear-gradient(135deg, ${primaryColor}08, ${accentColor}15)` }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-light mb-3 md:mb-4"
              style={{ 
                color: primaryColor,
                background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {t('rsvp.title')}
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg px-4">
              {t('rsvp.subtitle')}
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border"
              style={{ borderColor: `${primaryColor}20` }}
            >
              <EpicRSVPForm 
                weddingId={wedding.id} 
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section id="details" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-light text-center mb-12 md:mb-16"
            style={{ 
              color: primaryColor,
              background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {t('sections.weddingDetails')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16">
            {/* When */}
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 text-center shadow-lg border"
              style={{ borderColor: `${primaryColor}20` }}
            >
              <Calendar className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4" style={{ color: primaryColor }} />
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">{t('details.when')}</h3>
              <p className="text-gray-700 text-base md:text-lg mb-2">
                {wedding?.weddingDate ? format(new Date(wedding.weddingDate), 'd MMMM yyyy', { locale: getDateLocale() }) : t('details.dateTBD')}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {t('details.ceremonyBegins')} {wedding?.weddingTime || '4:00 PM'}
              </p>
            </div>

            {/* Where */}
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 text-center shadow-lg border"
              style={{ borderColor: `${primaryColor}20` }}
            >
              <MapPin className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4" style={{ color: primaryColor }} />
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">{t('details.where')}</h3>
              <p className="text-gray-700 text-base md:text-lg mb-2">{wedding?.venue || t('wedding.venue')}</p>
              <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{wedding?.venueAddress}</p>
              <div className="flex justify-center">
                <button 
                  onClick={() => {
                    const mapUrl = wedding?.mapPinUrl || wedding?.venueAddress;
                    if (mapUrl) {
                      // If it's already a full URL, open it directly
                      if (mapUrl.startsWith('http')) {
                        window.open(mapUrl, '_blank');
                      } else {
                        // Otherwise, create a Google Maps search URL
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapUrl)}`, '_blank');
                      }
                    }
                  }}
                  className="px-4 md:px-6 py-2 text-white rounded-full transition-colors hover:opacity-90 text-sm md:text-base"
                  style={{ backgroundColor: primaryColor }}
                  disabled={!wedding?.mapPinUrl && !wedding?.venueAddress}
                >
                  {t('details.showOnMap')}
                </button>
              </div>
            </div>
          </div>

          {/* Social Share */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">{t('share.title')}</h3>
            <p className="text-gray-600 mb-8">
              {t('share.subtitle')}
            </p>
            <div className="max-w-lg mx-auto">
              <EnhancedSocialShare
                weddingUrl={wedding.uniqueUrl}
                coupleName={`${wedding.bride} & ${wedding.groom}`}
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guest Book Section */}
      <section 
        id="guestbook" 
        className="py-20"
        style={{ background: `linear-gradient(135deg, ${primaryColor}08, ${accentColor}15)` }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-light mb-4"
              style={{ 
                color: primaryColor,
                background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {t('sections.guestBook')}
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              {t('guestBook.subtitle')}
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border"
                style={{ borderColor: `${primaryColor}20` }}
              >
                <h3 className="text-xl font-semibold mb-6 text-gray-800">{t('guestBook.leaveMessage')}</h3>
                <GuestBookForm 
                  weddingId={wedding.id}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                />
              </div>
              <div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border"
                style={{ borderColor: `${primaryColor}20` }}
              >
                <h3 className="text-xl font-semibold mb-6 text-gray-800">{t('guestBook.messages')}</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {guestBookEntries.length > 0 ? (
                    guestBookEntries.map((entry) => (
                      <div 
                        key={entry.id} 
                        className="p-6 rounded-2xl border"
                        style={{ 
                          backgroundColor: `${primaryColor}10`,
                          borderColor: `${primaryColor}20`
                        }}
                      >
                        <p className="text-gray-700 mb-3">{entry.message}</p>
                        <p className="font-medium" style={{ color: primaryColor }}>— {entry.guestName}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">{t('guestBook.noMessages')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-8 h-8 mx-auto mb-4" style={{ color: primaryColor }} />
          <h3 className="text-2xl font-light mb-2">
            {wedding?.bride} & {wedding?.groom}
          </h3>
          <p className="text-gray-300 mb-8">
            {t('wedding.thankYouGuests')}
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto mb-8">
            <h4 className="text-lg font-medium mb-4">{t('ad.orderInvitation')}</h4>
            <p className="text-gray-300 mb-4 text-sm">
              {t('ad.createWebsite')}
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://t.me/link_taklif" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full transition-colors flex items-center space-x-2 text-white"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span>Telegram</span>
              </a>
              <a 
                href="https://www.instagram.com/taklif_link?igsh=cjRra3cxcHN3Y3U1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-full transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center text-gray-400 text-sm">
            <span>{t('footer.poweredBy')}</span>
            <Heart className="inline h-4 w-4 mx-2" style={{ color: primaryColor }} />
            <span className="font-semibold" style={{ color: primaryColor }}>Taklif</span>
          </div>
        </div>
      </footer>
    </div>
  );
}