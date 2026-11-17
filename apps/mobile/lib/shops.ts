import type { Service, Shop } from './types';

function services(base: number): Service[] {
  return [
    { id: 'corte', name: 'Corte clásico', durationMin: 30, price: base },
    { id: 'fade', name: 'Fade', durationMin: 45, price: base + 2500 },
    { id: 'barba', name: 'Arreglo de barba', durationMin: 20, price: Math.round(base * 0.55) },
    { id: 'combo', name: 'Corte + barba', durationMin: 60, price: base + 4000 },
  ];
}

export const SHOPS: Shop[] = [
  {
    id: 'rivadavia',
    name: 'Barber Rivadavia',
    neighborhood: 'Balvanera',
    city: 'Buenos Aires',
    address: 'Av. Rivadavia 2322',
    rating: 4.86,
    reviewCount: 214,
    accent: '#1C1C1C',
    monogram: 'RV',
    tagline: 'Clásico de barrio, con turno en el día',
    about:
      'Un local chico sobre Rivadavia, con sillas de siempre y cortes prolijos. Ideal si querés entrar, sentarte y salir listo sin dar vueltas.',
    openHour: 10,
    closeHour: 20,
    closedWeekdays: [0],
    services: services(8000),
    barbers: [
      { id: 'martin', name: 'Martín', specialty: 'Clásico y barba' },
      { id: 'luisa', name: 'Luisa', specialty: 'Fade y diseño' },
    ],
  },
  {
    id: 'norte',
    name: 'Norte Fade',
    neighborhood: 'Palermo',
    city: 'Buenos Aires',
    address: 'Honduras 4821',
    rating: 4.93,
    reviewCount: 386,
    accent: '#243028',
    monogram: 'NF',
    tagline: 'Fades precisos y barba a navaja',
    about:
      'Estudio de Palermo para fades, diseño y barba. Trabajan de a un cliente por silla, con el horario que reservaste.',
    openHour: 11,
    closeHour: 21,
    closedWeekdays: [0],
    services: services(12000),
    barbers: [
      { id: 'nico', name: 'Nico', specialty: 'Skin fade' },
      { id: 'sofia', name: 'Sofía', specialty: 'Textura y color' },
      { id: 'ramiro', name: 'Ramiro', specialty: 'Barba' },
    ],
  },
  {
    id: 'corte-club',
    name: 'Corte Club',
    neighborhood: 'Villa Crespo',
    city: 'Buenos Aires',
    address: 'Thames 612',
    rating: 4.74,
    reviewCount: 151,
    accent: '#3E2A22',
    monogram: 'CC',
    tagline: 'El club de los cortes cortos',
    about:
      'Barbería de Villa Crespo con música baja y turnos cortos. Buena opción entre semana, a la salida del trabajo.',
    openHour: 10,
    closeHour: 20,
    closedWeekdays: [0, 1],
    services: services(9000),
    barbers: [
      { id: 'javi', name: 'Javi', specialty: 'Corte clásico' },
      { id: 'eva', name: 'Eva', specialty: 'Corte + barba' },
    ],
  },
  {
    id: 'old-school',
    name: 'Old School',
    neighborhood: 'San Telmo',
    city: 'Buenos Aires',
    address: 'Defensa 980',
    rating: 4.81,
    reviewCount: 268,
    accent: '#2A241C',
    monogram: 'OS',
    tagline: 'Navaja, toalla caliente y tiempo',
    about:
      'Local de San Telmo para quien busca el ritual completo: toalla caliente, navaja y un corte sin apuro.',
    openHour: 12,
    closeHour: 20,
    closedWeekdays: [1],
    services: services(10000),
    barbers: [
      { id: 'hector', name: 'Héctor', specialty: 'Navaja' },
      { id: 'camila', name: 'Camila', specialty: 'Clásico' },
    ],
  },
  {
    id: 'blade',
    name: 'Blade Studio',
    neighborhood: 'Belgrano',
    city: 'Buenos Aires',
    address: 'Cabildo 2140',
    rating: 4.9,
    reviewCount: 129,
    accent: '#1B3040',
    monogram: 'BS',
    tagline: 'Estudio luminoso, turnos puntuales',
    about:
      'Estudio de Belgrano con agenda corta y turnos que empiezan a horario. Cortes modernos y arreglo de barba.',
    openHour: 9,
    closeHour: 19,
    closedWeekdays: [0],
    services: services(11000),
    barbers: [
      { id: 'lola', name: 'Lola', specialty: 'Corte moderno' },
      { id: 'tomas', name: 'Tomás', specialty: 'Fade' },
    ],
  },
  {
    id: 'taller',
    name: 'Taller de Corte',
    neighborhood: 'Caballito',
    city: 'Buenos Aires',
    address: 'Acoyte 155',
    rating: 4.68,
    reviewCount: 97,
    accent: '#3A2E28',
    monogram: 'TC',
    tagline: 'Barbería de barrio en Caballito',
    about:
      'Un taller simple, a precio de barrio. Sirve para el corte de todas las semanas y para llevar a alguien de la casa.',
    openHour: 10,
    closeHour: 19,
    closedWeekdays: [0],
    services: services(7000),
    barbers: [
      { id: 'pedro', name: 'Pedro', specialty: 'Corte clásico' },
      { id: 'ana', name: 'Ana', specialty: 'Barba' },
    ],
  },
];

export function priceFrom(shop: Shop) {
  return Math.min(...shop.services.map((service) => service.price));
}

export function neighborhoods() {
  return [...new Set(SHOPS.map((shop) => shop.neighborhood))];
}
