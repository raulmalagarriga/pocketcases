import React from "react";

const REELS = [
  {
    id: 1,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_zRR7YhS3NVSrRBKEYa6u5_hHGnxMc89pxY3TZmfInVmov4-BsJusIpXe-637MsyZ7ouClHeYY_VTvrR1nC8V4eXctFAEScoW5ZuAkSrcGM3amrwmVfHZTO2HMktxplQ_2ctL0dCmr1j-TwDssKwSHHHMYPctCJ5v9gu_0vJrUpcacIDPE5NCs8SaKE0tIqId9aO3EG-QIspO_DufqPrg5wfEb3Y2sF_9iZpCeA",
    alt: "Customer aesthetic mirror selfie wearing oversized pastel knit sweater holding iPhone with Strawberry Milkshake wavy case in modern sunny apartment",
    quote:
      '"¡Se me cayó bajando las escaleras y ni un solo rasguño! Es demasiado bella."',
    handle: "@mia.in.ccs • Compradora Verificada",
    badgeClass: "text-primary-fixed",
  },
  {
    id: 2,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKUmmJnRbu6TGrqwvH5KeQLWpDJhOta1805Mls64d2lTsZZIcIt9rfNOu9-XncnKywOLQH6GbPnrffG5OKsGyFPr0K3dSDCE-FNB-FniG43qh0o-vEkdHsqM1FT03b-B8I2BkO8tLmmyrkuVhdTN521HwcZKa3CtFROR87H9NaCx0PrLrbc-rpS-UdZv46sfTumUSVsL-M2EtuDB1G1ipk9smmCuG41vl5wjvjtA",
    alt: "Close up aesthetic flat lay photo of girl desk setup with Matcha swirl phone case, matcha latte cup, mechanical pastel keyboard and sunglasses",
    quote:
      '"El agarre se siente supersuave y el MagSafe pega con muchísima fuerza."',
    handle: "@chloe.designs • Compradora Verificada",
    badgeClass: "text-tertiary-fixed",
  },
  {
    id: 3,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQauvziJMfircGLEHl-2Pw8Z4b3055oiSSx2unBQspDaU7sykP1aQo8aeaGC1ZNWLRlffEz-cr2075uxYuQM28_pH96-drzReRZtZvSlYE4QABxKFMTEafgbNodyHBwsH3lDI-6t9qbmfc2ICanwTBmOEg3b9nCCrGh7WFEMF_Q_jf_CvWEQfUbBwPgtgaNvqgn3IhjZAhapzNENlYpisTodS45DCT5c2KQ25zng",
    alt: "Cool trendy Gen Z girl holding phone with retro floral groovy case against a colorful vintage wall in Soho New York",
    quote:
      '"Pagué por WhatsApp y el delivery me llegó rapidísimo, brutal el servicio."',
    handle: "@elena_k • Compradora Verificada",
    badgeClass: "text-primary-fixed",
  },
  {
    id: 4,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6OodEXL_Z6-BjsHPK6RVu5nf0PIBXVIMdjBuixeeraJLFqnIqYhniefgyYHm8PxjOB54XFtPG1CocgRFenTwg_tZ2EnmUfF6ZNoLZZbX_1EAzMfB22P7mN44qIl-vTqv_cTPuvessAqqfU5kPQxbrb3Io5YV7DQPH1awOiAu0u-2Ehr1J-Ylhvbl9xxK0nK7ibXGDNFANMxFMiUmqxFaSGLAOJyun5flYwN1IoA",
    alt: "Sunlit aesthetic rooftop photo holding chrome mirror sorbet phone case showing vibrant colorful reflections of city skyline",
    quote:
      '"El espejo de atrás es tan nítido que me sirve para retocarme el maquillaje. Obsesionada."',
    handle: "@hannah.rooftop • Compradora Verificada",
    badgeClass: "text-tertiary-fixed",
  },
];

export function SocialProofReel() {
  return (
    <section
      id="social-proof"
      className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-2xl"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
        <div>
          <span className="inline-flex items-center gap-1 font-label-badge text-label-badge text-primary uppercase font-bold tracking-wider">
            <span className="material-symbols-outlined text-[14px]">
              photo_camera
            </span>{" "}
            #POCKETCASESENLACALLE
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            En la Calle con Pocket Cases
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Fotos reales compartidas por nuestra comunidad en Caracas, Lechería,
            Maracaibo y más.
          </p>
        </div>
        <div className="flex items-center gap-space-sm">
          <a
            className="px-space-md py-2 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-[2px_2px_0px_#2a3235] hover:bg-primary-fixed transition-all flex items-center gap-1.5"
            href="https://instagram.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[18px]">
              photo_camera
            </span>
            <span>Etiqueta a @pocketcases para aparecer</span>
          </a>
        </div>
      </div>

      {/* 4-Card Photo Reel Carousel Preview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        {REELS.map((reel) => (
          <div
            key={reel.id}
            className="group relative rounded-lg overflow-hidden bg-surface-container shadow-[3px_3px_0px_#2a3235]"
          >
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                alt={reel.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={reel.imageUrl}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-space-md text-white">
              <div className="flex items-center gap-1 text-[#f59e0b] text-[14px] mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-sm text-body-sm font-semibold text-white line-clamp-2">
                {reel.quote}
              </p>
              <span
                className={`font-label-badge text-label-badge ${reel.badgeClass} mt-1`}
              >
                {reel.handle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
