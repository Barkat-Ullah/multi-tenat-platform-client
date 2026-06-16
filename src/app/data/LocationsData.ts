export interface ClinicLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  image: string;
  lat: number;
  lng: number;
  googleMapsLink: string;
}

export const clinicLocations: ClinicLocation[] = [
  {
    id: "aberdeen",
    name: "Aberdeen",
    city: "Aberdeen",
    address: "Holiday Inn Aberdeen - West, Hill Of Rubislaw, Aberdeen, Aberdeenshire AB15 6XT, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1579625460838-8c14bb6571be?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 57.1497,
    lng: -2.0943,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Aberdeen+-+West,+Hill+Of+Rubislaw,+Aberdeen,+Aberdeenshire+AB15+6XT,+UK"
  },
  {
    id: "abergavenny",
    name: "Abergavenny",
    city: "Abergavenny",
    address: "Llanfoist Village Hall, Llanfoist, Abergavenny NP7 9HB, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 51.8228,
    lng: -3.0182,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Llanfoist+Village+Hall,+Llanfoist,+Abergavenny+NP7+9HB,+UK"
  },
  {
    id: "ashford",
    name: "Ashford",
    city: "Ashford",
    address: "Ashford International Hotel & Spa, Simone Weil Avenue, Ashford TN24 8UX, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 51.1465,
    lng: 0.8750,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Ashford+International+Hotel+%26+Spa,+Simone+Weil+Avenue,+Ashford+TN24+8UX,+UK"
  },
  {
    id: "ayr",
    name: "Ayr",
    city: "Ayr",
    address: "Premier Inn Ayr/Racecourse Hotel, Wheatpark Place, Ayr KA8 9RT, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 55.4586,
    lng: -4.6292,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Premier+Inn+Ayr/Racecourse+Hotel,+Wheatpark+Place,+Ayr+KA8+9RT,+UK"
  },
  {
    id: "banbury",
    name: "Banbury",
    city: "Banbury",
    address: "The Cromwell Lodge, North Bar Street, Banbury OX16 0TH, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1533563906091-fdfdffc3e3c4?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 52.0618,
    lng: -1.3361,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=The+Cromwell+Lodge,+North+Bar+Street,+Banbury+OX16+0TH,+UK"
  },
  {
    id: "bangor",
    name: "Bangor",
    city: "Bangor",
    address: "Bangor University, Bangor LL57 2DG, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 53.2274,
    lng: -4.1292,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Bangor+University,+Bangor+LL57+2DG,+UK"
  },
  {
    id: "barnsley",
    name: "Barnsley",
    city: "Barnsley",
    address: "Holiday Inn Barnsley M1 J37, Road Hill, Barnsley S75 3JT, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 53.5526,
    lng: -1.4797,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Barnsley+M1+J37,+Road+Hill,+Barnsley+S75+3JT,+UK"
  },
  {
    id: "basildon",
    name: "Basildon",
    city: "Basildon",
    address: "Holiday Inn Basildon, Waterfront Walk, Basildon SS14 3DG, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 51.5761,
    lng: 0.4887,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Basildon,+Waterfront+Walk,+Basildon+SS14+3DG,+UK"
  },
  {
    id: "belfast",
    name: "Belfast",
    city: "Belfast",
    address: "Corr's Corner Hotel, Ballyclare Road, Newtownabbey BT36 4TQ, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 54.5973,
    lng: -5.9301,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Corr's+Corner+Hotel,+Ballyclare+Road,+Newtownabbey+BT36+4TQ,+UK"
  },
  {
    id: "bicester",
    name: "Bicester",
    city: "Bicester",
    address: "Holiday Inn Express Bicester, an IHG Hotel, Wendlebury Road, Bicester OX25 2RE, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 51.8994,
    lng: -1.1524,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Express+Bicester,+an+IHG+Hotel,+Wendlebury+Road,+Bicester+OX25+2RE,+UK"
  },
  {
    id: "birmingham",
    name: "Birmingham",
    city: "Birmingham",
    address: "Holiday Inn Express Birmingham NEC, Birmingham B40 1QA, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 52.4862,
    lng: -1.8904,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Express+Birmingham+NEC,+Birmingham+B40+1QA,+UK"
  },
  {
    id: "blackburn",
    name: "Blackburn",
    city: "Blackburn",
    address: "The Witton Clinic, 933 Whalley New Road, Blackburn BB1 9BE, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 53.7480,
    lng: -2.4820,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=The+Witton+Clinic,+933+Whalley+New+Road,+Blackburn+BB1+9BE,+UK"
  },
  {
    id: "blackpool",
    name: "Blackpool",
    city: "Blackpool",
    address: "Grand Hotel Blackpool, Promenade, Blackpool FY1 2JQ, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 53.8175,
    lng: -3.0357,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Grand+Hotel+Blackpool,+Promenade,+Blackpool+FY1+2JQ,+UK"
  },
  {
    id: "bradford",
    name: "Bradford",
    city: "Bradford",
    address: "Holiday Inn Express Bradford City Centre, Vicar Lane, Bradford BD1 5LD, UK",
    phone: "03003030668",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&h=300&q=80",
    lat: 53.7959,
    lng: -1.7594,
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Express+Bradford+City+Centre,+Vicar+Lane,+Bradford+BD1+5LD,+UK"
  }
];
