"use client";
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect } from 'react';
import Image from 'next/image';

const companies = [
  {
    name: 'Amazon',
    logo: '/logos/amazon.svg'
  },
  {
    name: 'Chelsea',
    logo: '/logos/chelsea.svg'
  },
  {
    name: 'Google',
    logo: '/logos/google.svg'
  },
  {
    name: 'Lenovo',
    logo: '/logos/lenovo.svg'
  },
  {
    name: 'Mastercard',
    logo: '/logos/mastercard.svg'
  },
  {
    name: 'Microsoft',
    logo: '/logos/microsoft.svg'
  },
  {
    name: 'Nokia',
    logo: '/logos/nokia.svg'
  },
  {
    name: 'Oracle',
    logo: '/logos/oracle.svg'
  },
  {
    name: 'Postgresql',
    logo: '/logos/postgresql.svg'
  },
  {
    name: 'Puma',
    logo: '/logos/puma.svg'
  },
  {
    name: 'Samsung',
    logo: '/logos/samsung.svg'
  },
  {
    name: 'Tesla',
    logo: '/logos/tesla.svg'
  },
  {
    name: 'Uber',
    logo: '/logos/uber.svg'
  },
];

export default function CompanyLogos() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    align: 'center',
    containScroll: 'trimSnaps'
  });

  useEffect(() => {
    if (emblaApi) {
      const intervalId = setInterval(() => {
        emblaApi.scrollNext();
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [emblaApi]);

  return (
    <div className="pt-12 text-blue-600">
      <p className="font-medium text-center mb-8">Trusted by professionals from</p>
      <div className="overflow-hidden mx-auto max-w-[90%]" ref={emblaRef}>
        <div className="flex cursor-grab active:cursor-grabbing">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex-[0_0_180px] min-w-0 flex items-center justify-center"
            >
              <Image
                src={company.logo}
                alt={company.name}
                width={56}
                height={56}
                className="h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}