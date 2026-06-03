/*
 * © 2026 MedКарта Казань. Все права защищены.
 * Этот код является интеллектуальной собственностью автора.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import {
  Bike,
  Building2,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Footprints,
  Gauge,
  Heart,
  HeartOff,
  Hospital,
  Loader2,
  MapPin,
  Moon,
  Navigation,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Star,
  Sun,
  Target,
  TrendingUp,
  UserRound,
  XCircle,
  Bot,
  GripVertical,
} from 'lucide-react';
import { doctorsData } from './doctors';
import { kazanFacilities } from './kazanFacilities';
import { ClinicsData } from './ClinicsData';
import AIAssistant from './AIAssistant';
import { getApiKey } from './services/ai';


delete L.Icon.Default.prototype._getIconUrl;

const createBeautifulArrow = (color, isUser = false, label = null) => {
  const size = isUser ? [26, 26] : [34, 46];
  const anchor = isUser ? [13, 13] : [17, 46];
  const popupAnchor = isUser ? [0, -13] : [0, -42];

  let innerContent = '<circle cx="12" cy="12" r="5" fill="white"/>';
  if (label) {
    innerContent = `
      <circle cx="12" cy="12" r="8" fill="white"/>
      <text x="12" y="15.5" font-family="Arial, sans-serif" font-weight="bold" font-size="10" text-anchor="middle" fill="${color}">${label}</text>
    `;
  }

  const svgHtml = isUser
    ? '<div class="user-location-marker"><div class="user-location-dot"></div></div>'
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="34" height="46" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9.07 10.667 21.6 11.23 22.251a1 1 0 0 0 1.54 0C13.333 33.6 24 21.07 24 12c0-6.627-5.373-12-12-12z" fill="${color}" stroke="white" stroke-width="1.5"/>
        ${innerContent}
      </svg>`;

  return L.divIcon({
    html: svgHtml,
    className: isUser ? 'user-div-icon cursor-grab active:cursor-grabbing' : 'doctor-div-icon',
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor,
  });
};
const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const storageKey = 'med-navigator-favorites';

const blueArrowIcon = createBeautifulArrow('#3b82f6');

const violetArrowIcon = createBeautifulArrow('#8b5cf6');
const amberArrowIcon = createBeautifulArrow('#f59e0b');
const userDotIcon = createBeautifulArrow('#ef4444', true);
const hasGeolocationSupport = typeof navigator !== 'undefined' && Boolean(navigator.geolocation);
const defaultLocation = [55.7963, 49.1088];
const institutionTypes = ['Клиника', 'Больница', 'Госпиталь', 'Медцентр', 'Поликлиника', 'Амбулатория', 'Медучреждение', 'Стоматология'];
const institutionTypeSet = new Set(institutionTypes);

const resolveFacilityType = (item) => {
  if (item.facilityType) {
    return item.facilityType;
  }

  if (institutionTypeSet.has(item.specialty)) {
    return item.specialty;
  }

  return 'Клиника';
};

const resolveDoctorProfile = (item) => {
  if (!item.specialty || institutionTypeSet.has(item.specialty)) {
    return null;
  }

  return item.specialty;
};

const normalizeScheduleValue = (value) => {
  if (value === null || value === undefined) {
    return 'Выходной';
  }

  const text = String(value).trim();
  if (!text || text.toLowerCase() === 'null') {
    return 'Выходной';
  }

  return text;
};

const extractClinicsSchedule = (doctorSchedule, clinicHours) => {
  const source = doctorSchedule || clinicHours;
  if (!source) {
    return null;
  }

  return {
    mon: normalizeScheduleValue(source.mon),
    tue: normalizeScheduleValue(source.tue),
    wed: normalizeScheduleValue(source.wed),
    thu: normalizeScheduleValue(source.thu),
    fri: normalizeScheduleValue(source.fri),
    sat: normalizeScheduleValue(source.sat),
    sun: normalizeScheduleValue(source.sun),
  };
};

const mapClinicsToFacilities = (payload) => {
  if (!payload || !Array.isArray(payload.clinics)) {
    return [];
  }

  const facilities = [];

  payload.clinics.forEach((clinic) => {
    const clinicTitle = clinic.branch_name ? `${clinic.name} (${clinic.branch_name})` : clinic.name;
    const clinicDoctors = Array.isArray(clinic.doctors) && clinic.doctors.length > 0 ? clinic.doctors : [null];

    clinicDoctors.forEach((doctor, index) => {
      const doctorName = doctor?.full_name || `Врач клиники №${index + 1}`;
      const specialty = doctor?.specialty || clinic.facility_type || 'Специалист';
      const website = clinic.website || '';
      const booking = clinic.booking_url || '';
      const phone = Array.isArray(clinic.phones) && clinic.phones.length > 0 ? clinic.phones[0] : '';
      const hoursRaw = doctor?.schedule?.raw || clinic.working_hours?.raw || 'График не указан';

      facilities.push({
        id: `clinics-${clinic.clinic_id}-${doctor?.doctor_id || index}`,
        name: doctorName,
        specialty,
        clinic: clinicTitle,
        address: clinic.address_full || '',
        district: clinic.district || '',
        ownership: clinic.ownership || 'Не определено',
        rating: 0,
        experience: doctor?.experience_years || 0,
        schedule: extractClinicsSchedule(doctor?.schedule, clinic.working_hours),
        hours: hoursRaw,
        phone,
        website,
        services: [clinic.facility_type, specialty].filter(Boolean),
        features: {
          onlineBooking: Boolean(booking || website),
          wheelchair: false,
          parking: false,
          children: /дет/i.test(clinicTitle),
          eveningReception: false,
          weekendReception: false,
        },
        description: clinic.doctor_list_completeness === 'partial' ? 'Состав врачей частично подтвержден.' : 'Данные клиники подтверждены.',
        lat: clinic.coordinates?.lat,
        lng: clinic.coordinates?.lng,
        facilityType: clinic.facility_type || specialty,
        source: 'ClinicsData',
      });
    });
  });

  return facilities.filter((item) => typeof item.lat === 'number' && typeof item.lng === 'number');
};

// Initial map view reset (once)
const InitialCenterMap = ({ location }) => {
  const map = useMap();
  const doneRef = useRef(false);

  useEffect(() => {
    if (location && !doneRef.current) {
      doneRef.current = true;
      map.setView(location, 13, { animate: false });
    }
  }, [location, map]);

  return null;
};

// Animate map transition to coordinates
const FlyToPoint = ({ target, onDone }) => {
  const map = useMap();
  const prevTarget = useRef(null);
  useEffect(() => {
    if (target && target !== prevTarget.current) {
      prevTarget.current = target;
      map.flyTo(target, map.getZoom() < 14 ? 15 : map.getZoom(), { duration: 1.0 });
      if (onDone) setTimeout(onDone, 1100);
    }
  }, [target, map, onDone]);
  return null;
};

const InvalidateMapSize = () => {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      // Avoid ResizeObserver loop limit error
      window.requestAnimationFrame(() => {
        map.invalidateSize(false);
      });
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [map]);

  return null;
};

const RoutingMachine = ({ originLocation, routeTargets, travelMode, setRouteData }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  // Стабилизация: округляем координаты до 4 знаков (~11 метров)
  const roundCoord = (val) => Number(Number(val).toFixed(4));
  const routeKey = JSON.stringify({
    o: originLocation ? [roundCoord(originLocation[0]), roundCoord(originLocation[1])] : null,
    t: (routeTargets || []).map(r => [roundCoord(r.lat), roundCoord(r.lng)]),
    m: travelMode
  });

  useEffect(() => {
    if (!map || !originLocation || !routeTargets || routeTargets.length === 0) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    const lineColors = { driving: '#3b82f6', foot: '#10b981', bike: '#a855f7' };
    const serviceUrls = {
      driving: 'https://routing.openstreetmap.de/routed-car/route/v1',
      foot: 'https://routing.openstreetmap.de/routed-foot/route/v1',
      bike: 'https://routing.openstreetmap.de/routed-bike/route/v1',
    };

    try {
      const router = L.Routing.osrmv1({
        serviceUrl: serviceUrls[travelMode],
        profile: 'driving',
      });

      const waypoints = [
        L.latLng(originLocation[0], originLocation[1]),
        ...routeTargets.map(t => L.latLng(t.lat, t.lng))
      ];

      routingControlRef.current = L.Routing.control({
        waypoints,
        router,
        lineOptions: { styles: [{ color: lineColors[travelMode], weight: 6, opacity: 0.9 }] },
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        createMarker: function () {
          return null;
        },
      }).addTo(map);

      routingControlRef.current.on('routesfound', function (event) {
        if (event.routes && event.routes.length > 0) {
          const summary = event.routes[0].summary;
          setRouteData({ distance: summary.totalDistance, time: summary.totalTime, error: false });
        }
      });

      routingControlRef.current.on('routingerror', function () {
        setRouteData({ distance: 0, time: 0, error: true });
      });
    } catch (error) {
      console.error('Ошибка маршрута:', error);
    }

    return () => {
      if (routingControlRef.current && map) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, routeKey, setRouteData]);

  return null;
};

const timeToMinutes = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const parts = value.trim().split(':');
  if (parts.length !== 2) {
    return null;
  }

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

const normalizeText = (value) => (value ? value.toString().toLowerCase() : '');

const normalizeClinicKey = (value) =>
  (value || '')
    .toString()
    .toLowerCase()
    .replace(/[«»"'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const scheduleTextToRange = (value) => {
  if (!value || /выход/i.test(value) || /closed/i.test(value)) {
    return null;
  }

  const normalized = value.toLowerCase();
  if (normalized.includes('круглосуточ')) {
    return { start: 0, end: 24 * 60 };
  }

  const rangePart = value.split(';')[0].split(',')[0].trim();
  const dashIndex = rangePart.indexOf('-');
  if (dashIndex === -1) {
    return null;
  }

  const start = timeToMinutes(rangePart.slice(0, dashIndex).trim());
  const end = timeToMinutes(rangePart.slice(dashIndex + 1).trim());
  if (start === null || end === null) {
    return null;
  }

  return { start, end };
};

const isScheduleOpenNow = (schedule, now) => {
  if (!schedule) {
    return false;
  }

  const key = dayKeys[now.getDay()];
  const range = scheduleTextToRange(schedule[key]);
  if (!range) {
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= range.start && currentMinutes < range.end;
};

const isWeekendReception = (schedule) => {
  if (!schedule) {
    return false;
  }

  return Boolean(schedule.sat && !/выход/i.test(schedule.sat)) || Boolean(schedule.sun && !/выход/i.test(schedule.sun));
};

const hasEveningReception = (schedule) => {
  if (!schedule) {
    return false;
  }

  return dayKeys.some((dayKey) => {
    const range = scheduleTextToRange(schedule[dayKey]);
    return range && range.end >= 20 * 60;
  });
};

const getTodaySchedule = (schedule, now) => {
  if (!schedule) {
    return 'График уточняется';
  }

  return schedule[dayKeys[now.getDay()]] || 'График уточняется';
};

const calculateDistanceKm = (origin, target) => {
  if (!origin || !target) {
    return null;
  }

  const [lat1, lon1] = origin;
  const [lat2, lon2] = target;
  const earthRadius = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;

  const latDelta = toRadians(lat2 - lat1);
  const lonDelta = toRadians(lon2 - lon1);
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const formatDistance = (meters) => {
  if (meters == null) {
    return '—';
  }

  if (meters < 1000) {
    return `${Math.round(meters)} м`;
  }

  return `${(meters / 1000).toFixed(1)} км`;
};

const formatTime = (seconds) => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} ч ${mins} мин`;
};

const StatTile = ({ label, value, tone = 'blue' }) => {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800',
    amber: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800',
    slate: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600',
  };

  return (
    <div className={`rounded-xl border px-2.5 py-2 ${tones[tone]}`}>
      <div className="text-[10px] uppercase tracking-[0.16em] opacity-70">{label}</div>
      <div className="mt-0.5 text-base font-extrabold leading-none">{value}</div>
    </div>
  );
};

const ToggleChip = ({ active, onClick, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:bg-blue-700 dark:text-blue-50 dark:shadow-blue-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'}`}
  >
    {children}
  </button>
);

export default function App() {
  const [userLocation, setUserLocation] = useState(defaultLocation);
  const [routeTargets, setRouteTargets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationError, setLocationError] = useState(!hasGeolocationSupport);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [flyToTarget, setFlyToTarget] = useState(null);
  const [customOrigin, setCustomOrigin] = useState(null);
  const [isManualOrigin, setIsManualOrigin] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [travelMode, setTravelMode] = useState('driving');
  const [routeData, setRouteData] = useState(null);
  const [isRouteStarted, setIsRouteStarted] = useState(false);
  const [sortBy, setSortBy] = useState('recommendation');
  const [selectedFacilityType, setSelectedFacilityType] = useState('all');
  const [selectedClinic, setSelectedClinic] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState('all');
  const [selectedOwnership, setSelectedOwnership] = useState('all');
  const [cardDisplayMode, setCardDisplayMode] = useState('all');
  const [selectedServices, setSelectedServices] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [weekendOnly, setWeekendOnly] = useState(false);
  const [eveningOnly, setEveningOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [childrenOnly, setChildrenOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [maxDistance, setMaxDistance] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [now, setNow] = useState(() => new Date());
  const [isLocationReady, setIsLocationReady] = useState(!hasGeolocationSupport);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(true);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('facility');
  const [mobileSheetDragOffset, setMobileSheetDragOffset] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('med-navigator-dark-mode') || 'false');
    } catch {
      return false;
    }
  });

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isRoutePanelCollapsed, setIsRoutePanelCollapsed] = useState(false);
  const [buildRouteTrigger, setBuildRouteTrigger] = useState(false);
  const [targetStopsTrigger, setTargetStopsTrigger] = useState(null); // Apply processing results to UI state

  const handleApplyTriage = useCallback((result) => {
    // === МАРШРУТ ===
    if (result.clearRoute && !result.clearFilters) {
      setRouteTargets([]);
      setRouteData(null);
    }

    // === СБРОС ФИЛЬТРОВ (НЕ трогает маршрут!) ===
    if (result.clearFilters) {
      setSearchQuery('');
      setIsSearchFocused(false);
      setSelectedFacilityType('all');
      setSelectedClinic('all');
      setSelectedDistrict('all');
      setSelectedDoctorProfile('all');
      setSelectedOwnership('all');
      setCardDisplayMode('all');
      setSelectedServices([]);
      setFavoritesOnly(false);
      setOpenOnly(false);
      setWeekendOnly(false);
      setEveningOnly(false);
      setOnlineOnly(false);
      setWheelchairOnly(false);
      setChildrenOnly(false);
      setMinRating(0);
      setMinExperience(0);
      setMaxDistance(0);
      setSortBy('recommendation');
    }

    // === ТЁМНАЯ ТЕМА ===
    if (result.darkMode === true) setIsDarkMode(true);
    if (result.darkMode === false) setIsDarkMode(false);

    // === РЕЖИМ ПЕРЕДВИЖЕНИЯ ===
    if (result.travelMode && ['driving', 'foot', 'bike'].includes(result.travelMode)) {
      setTravelMode(result.travelMode);
    }

    // === ФИЛЬТРЫ ===
    if (result.ownership && ['Государственная', 'Частная'].includes(result.ownership)) {
      setSelectedOwnership(result.ownership);
    }
    if (result.district) setSelectedDistrict(result.district);
    if (result.cardDisplayMode && ['all', 'doctor', 'facility'].includes(result.cardDisplayMode)) {
      setCardDisplayMode(result.cardDisplayMode);
    }
    if (result.openOnly === true) setOpenOnly(true);
    if (result.openOnly === false) setOpenOnly(false);
    if (result.favoritesOnly === true) setFavoritesOnly(true);
    if (result.favoritesOnly === false) setFavoritesOnly(false);
    if (result.weekendOnly === true) setWeekendOnly(true);
    if (result.weekendOnly === false) setWeekendOnly(false);
    if (result.eveningOnly === true) setEveningOnly(true);
    if (result.eveningOnly === false) setEveningOnly(false);
    if (result.onlineOnly === true) setOnlineOnly(true);
    if (result.onlineOnly === false) setOnlineOnly(false);
    if (result.wheelchairOnly === true) setWheelchairOnly(true);
    if (result.wheelchairOnly === false) setWheelchairOnly(false);
    if (result.isChild) setChildrenOnly(true);

    if (typeof result.minRating === 'number' && !Number.isNaN(result.minRating)) {
      setMinRating(Math.max(0, Math.min(5, result.minRating)));
    }
    if (typeof result.minExperience === 'number' && !Number.isNaN(result.minExperience)) {
      setMinExperience(Math.max(0, Math.min(40, result.minExperience)));
    }
    if (typeof result.maxDistance === 'number' && !Number.isNaN(result.maxDistance)) {
      setMaxDistance(Math.max(0, Math.min(50, result.maxDistance)));
    }

    if (typeof result.clinic === 'string' && result.clinic.trim()) {
      setSelectedClinic(result.clinic.trim());
    }
    if (typeof result.facilityType === 'string' && result.facilityType.trim()) {
      setSelectedFacilityType(result.facilityType.trim());
    }
    if (typeof result.doctorProfile === 'string' && result.doctorProfile.trim()) {
      setSelectedDoctorProfile(result.doctorProfile.trim());
    }
    if (Array.isArray(result.services)) {
      const normalizedServices = result.services
        .filter((service) => typeof service === 'string')
        .map((service) => service.trim())
        .filter(Boolean)
        .slice(0, 6);
      setSelectedServices(normalizedServices);
    }

    // === СОРТИРОВКА ===
    if (result.sortMode === 'distance') setSortBy('distance');
    else if (result.sortMode === 'rating') setSortBy('rating');

    // Если только clearRoute/clearFilters без дополнительных действий — выходим
    if ((result.clearRoute || result.clearFilters) && !result.specialty && !result.service && !result.searchQuery && !result.buildRoute && !result.targetStops?.length) {
      return;
    }

    // Complex routing
    if (result.targetStops && result.targetStops.length > 0) {
      setTimeout(() => setTargetStopsTrigger(result.targetStops), 100);
      return;
    }

    // === ПОИСК ===
    // searchQuery — универсальный поиск (по клинике, адресу, врачу и т.д.)
    const isGenericRouteQuery = (value) => {
      if (!value || typeof value !== 'string') {
        return false;
      }

      const text = value.trim().toLowerCase();
      if (!text) {
        return false;
      }

      return /маршрут|путь|дорог|ближайш\s+маршрут|построй\s+маршрут/.test(text);
    };

    if (result.searchQuery && !isGenericRouteQuery(result.searchQuery)) {
      setSearchQuery(result.searchQuery);
    } else if (result.specialty) {
      setSearchQuery(result.specialty);
      setActiveFilterTab('specialist');
    } else if (result.service) {
      setSearchQuery(result.service);
      setActiveFilterTab('services');
    }

    // === ПОСТРОИТЬ МАРШРУТ ===
    if (result.buildRoute && !result.clearRoute && !result.clearFilters) {
      const candidates = enrichedDoctorsRef.current.filter((doc) => {
        const specialtyMatch = result.specialty
          ? (doc.specialty && doc.specialty.toLowerCase().includes(result.specialty.toLowerCase()))
          : true;
        const queryMatch = result.searchQuery && !result.specialty
          ? [doc.name, doc.specialty, doc.clinic, doc.address].join(' ').toLowerCase().includes(result.searchQuery.toLowerCase())
          : true;

        return specialtyMatch && queryMatch;
      });

      const sortedCandidates = [...candidates].sort((left, right) => (left.distanceKm || Infinity) - (right.distanceKm || Infinity));
      setRouteTargets((prev) => {
        const bestMatch = sortedCandidates.find((doc) => !prev.some((target) => target.id === doc.id));

        if (!bestMatch || prev.length >= 5) {
          return prev;
        }

        setRouteData(null);
        setFlyToTarget([bestMatch.lat, bestMatch.lng]);
        return [...prev, bestMatch];
      });
    }
  }, []);



  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1024);

  const quickFilterTags = [
    { label: '🩺 Терапевт', value: 'Терапевт', icon: '🩺' },
    { label: '❤️ Кардиолог', value: 'Кардиолог', icon: '❤️' },
    { label: '👃 ЛОР', value: 'ЛОР', icon: '👃' },
    { label: '👁️ Офтальмолог', value: 'Офтальмолог', icon: '👁️' },
    { label: '🦷 Стоматолог', value: 'Стоматолог', icon: '🦷' },
    { label: '🧠 Невролог', value: 'Невролог', icon: '🧠' },
  ];

  const sidebarRef = useRef(null);
  const mobileSheetTouchStartYRef = useRef(null);
  const pendingSidebarWidthRef = useRef(sidebarWidth);
  const resizeFrameRef = useRef(null);
  const enrichedDoctorsRef = useRef([]);
  const clinicsFacilities = useMemo(() => mapClinicsToFacilities(ClinicsData), []);
  const sourceFacilities = useMemo(() => {
    // Объединяем оба источника: ручной список и сгенерированный
    const base = [...doctorsData, ...kazanFacilities, ...clinicsFacilities];
    const clinicAddressMap = new Map();
    const clinicCoordsMap = new Map();

    base.forEach((item) => {
      const clinicName = (item.clinic || '').trim();
      const clinicKey = normalizeClinicKey(clinicName);
      const address = (item.address || '').trim();
      const hasCoords = typeof item.lat === 'number' && typeof item.lng === 'number';
      const isDoctor = Boolean(resolveDoctorProfile(item));

      if (clinicKey && address && !/уточняется/i.test(address) && !clinicAddressMap.has(clinicKey)) {
        clinicAddressMap.set(clinicKey, address);
      }

      if (clinicKey && hasCoords && !isDoctor && !clinicCoordsMap.has(clinicKey)) {
        clinicCoordsMap.set(clinicKey, { lat: item.lat, lng: item.lng });
      }
    });

    base.forEach((item) => {
      const clinicKey = normalizeClinicKey(item.clinic || '');
      const hasCoords = typeof item.lat === 'number' && typeof item.lng === 'number';
      if (clinicKey && hasCoords && !clinicCoordsMap.has(clinicKey)) {
        clinicCoordsMap.set(clinicKey, { lat: item.lat, lng: item.lng });
      }
    });

    return base
      .map((item) => {
        const clinicName = (item.clinic || '').trim();
        const clinicKey = normalizeClinicKey(clinicName);
        const fallbackAddress = clinicKey ? clinicAddressMap.get(clinicKey) : null;
        const fallbackCoords = clinicKey ? clinicCoordsMap.get(clinicKey) : null;
        const currentAddress = (item.address || '').trim();
        const normalizedAddress = currentAddress && !/уточняется/i.test(currentAddress)
          ? currentAddress
          : fallbackAddress || '';
        const isDoctor = Boolean(resolveDoctorProfile(item));
        const normalizedLat = isDoctor && fallbackCoords ? fallbackCoords.lat : item.lat;
        const normalizedLng = isDoctor && fallbackCoords ? fallbackCoords.lng : item.lng;

        return {
          ...item,
          address: normalizedAddress,
          lat: normalizedLat,
          lng: normalizedLng,
        };
      })
      .filter((item) => {
        const address = (item.address || '').trim();
        const hasCoords = typeof item.lat === 'number' && typeof item.lng === 'number';
        return Boolean(address) && !/уточняется/i.test(address) && hasCoords;
      });
  }, [clinicsFacilities]);

  const activeOrigin = isManualOrigin && customOrigin ? customOrigin : userLocation;

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 300000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch (error) {
      console.error(error);
    }
  }, [favorites]);

  useEffect(() => {
    pendingSidebarWidthRef.current = sidebarWidth;
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${sidebarWidth}px`;
    }
  }, [sidebarWidth]);

  useEffect(() => {
    if (!isDraggingPanel) {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = '';
      return undefined;
    }

    const applyWidth = () => {
      resizeFrameRef.current = null;
      if (sidebarRef.current) {
        sidebarRef.current.style.width = `${pendingSidebarWidthRef.current}px`;
      }
    };

    const handleMouseMove = (event) => {
      pendingSidebarWidthRef.current = Math.max(360, Math.min(event.clientX, window.innerWidth / 2.1));
      if (!resizeFrameRef.current) {
        resizeFrameRef.current = requestAnimationFrame(applyWidth);
      }
    };

    const handleMouseUp = () => {
      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
      setSidebarWidth(pendingSidebarWidthRef.current);
      setIsDraggingPanel(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = '';
      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
    };
  }, [isDraggingPanel]);

  useEffect(() => {
    if (!hasGeolocationSupport) {
      return undefined;
    }

    let watchId;
    const fallbackTimer = window.setTimeout(() => {
      // Use fallback location on timeout
      setUserLocation(defaultLocation);
      setLocationError(true);
      setIsLocationReady(true);
    }, 8000);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        window.clearTimeout(fallbackTimer);
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setIsLocationReady(true);
      },
      () => {
        window.clearTimeout(fallbackTimer);
        setUserLocation(defaultLocation);
        setLocationError(true);
        setIsLocationReady(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 },
    );

    return () => {
      window.clearTimeout(fallbackTimer);
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = window.innerWidth;
        setIsMobile(w < 768);
        setIsTablet(w >= 768 && w <= 1024);
        if (w < 768) {
          setSidebarWidth(420);
        } else if (w <= 1024) {
          setSidebarWidth(340);
        } else {
          setIsMobileFiltersOpen(false);
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('med-navigator-dark-mode', JSON.stringify(isDarkMode));
    } catch (error) {
      console.error(error);
    }
    const root = document.documentElement;
    root.classList.add('theme-switching');
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const rafId = requestAnimationFrame(() => {
      root.classList.remove('theme-switching');
    });

    return () => {
      cancelAnimationFrame(rafId);
      root.classList.remove('theme-switching');
    };
  }, [isDarkMode]);

  const enrichedDoctors = useMemo(
    () =>
      sourceFacilities.map((doc) => {
        const distanceKm = activeOrigin ? calculateDistanceKm(activeOrigin, [doc.lat, doc.lng]) : null;
        const openNow = isScheduleOpenNow(doc.schedule, now);
        const weekendReception = isWeekendReception(doc.schedule);
        const eveningReception = hasEveningReception(doc.schedule);
        const todayHours = getTodaySchedule(doc.schedule, now);
        const facilityType = resolveFacilityType(doc);
        const doctorProfile = resolveDoctorProfile(doc);
        const entityKind = doctorProfile ? 'doctor' : 'facility';

        let trustBadges = [];
        if (entityKind === 'doctor') {
          if (doc.experience >= 15) trustBadges.push('Опытный врач');
          if (doc.experience >= 20) trustBadges.push('Высший стаж');
          if (doc.rating >= 4.8) trustBadges.push('Топ-врач');
          if (doc.rating >= 4.5) trustBadges.push('Популярный');
          if (doc.features.children) trustBadges.push('Детский врач');
        } else if (entityKind === 'facility') {
          if (doc.ownership === 'Государственная') trustBadges.push('Государственное');
          trustBadges.push(doc.facilityType || 'Медучреждение');
        }

        return {
          ...doc,
          distanceKm,
          openNow,
          weekendReception,
          eveningReception,
          todayHours,
          facilityType,
          doctorProfile,
          entityKind,
          trustBadges,
          isFavorite: favorites.includes(doc.id),
        };
      }),
    [activeOrigin, favorites, now, sourceFacilities],
  );

  useEffect(() => {
    enrichedDoctorsRef.current = enrichedDoctors;
  }, [enrichedDoctors]);

  const clinics = useMemo(() => [...new Set(sourceFacilities.map((doc) => doc.clinic))].sort((left, right) => left.localeCompare(right, 'ru')), [sourceFacilities]);
  const districts = useMemo(() => [...new Set(sourceFacilities.map((doc) => doc.district).filter(Boolean))].sort((left, right) => left.localeCompare(right, 'ru')), [sourceFacilities]);
  const doctorProfiles = useMemo(
    () => [...new Set(sourceFacilities.map((doc) => resolveDoctorProfile(doc)).filter(Boolean))].sort((left, right) => left.localeCompare(right, 'ru')),
    [sourceFacilities],
  );
  const ownerships = useMemo(() => [...new Set(sourceFacilities.map((doc) => doc.ownership))].sort((left, right) => left.localeCompare(right, 'ru')), [sourceFacilities]);
  const facilityTypes = useMemo(
    () => [...new Set(sourceFacilities.map((doc) => resolveFacilityType(doc)).filter(Boolean))].sort((left, right) => left.localeCompare(right, 'ru')),
    [sourceFacilities],
  );
  const allServices = useMemo(
    () => [...new Set(sourceFacilities.flatMap((doc) => doc.services || []))].sort((left, right) => left.localeCompare(right, 'ru')),
    [sourceFacilities],
  );

  const searchSuggestions = useMemo(() => {
    if (!isSearchFocused) {
      return [];
    }

    const query = normalizeText(searchQuery).trim();
    if (query.length < 2) {
      return [];
    }

    const unique = new Map();
    for (let i = 0; i < sourceFacilities.length; i++) {
      const doc = sourceFacilities[i];
      if (doc.name) { const k = normalizeText(doc.name); if (!unique.has(k)) unique.set(k, { value: doc.name, type: 'Имя' }); }
      if (doc.clinic) { const k = normalizeText(doc.clinic); if (!unique.has(k)) unique.set(k, { value: doc.clinic, type: 'Клиника' }); }
      if (doc.specialty) { const k = normalizeText(doc.specialty); if (!unique.has(k)) unique.set(k, { value: doc.specialty, type: 'Специальность' }); }
      if (doc.district) { const k = normalizeText(doc.district); if (!unique.has(k)) unique.set(k, { value: doc.district, type: 'Район' }); }
      const services = doc.services;
      if (services) {
        for (let j = 0; j < services.length; j++) {
          if (services[j]) { const k = normalizeText(services[j]); if (!unique.has(k)) unique.set(k, { value: services[j], type: 'Услуга' }); }
        }
      }
    }

    const results = [];
    for (const item of unique.values()) {
      if (normalizeText(item.value).includes(query)) {
        results.push(item);
      }
    }

    results.sort((left, right) => {
      const leftText = normalizeText(left.value);
      const rightText = normalizeText(right.value);
      const leftStarts = leftText.startsWith(query);
      const rightStarts = rightText.startsWith(query);
      if (leftStarts !== rightStarts) {
        return Number(rightStarts) - Number(leftStarts);
      }
      return leftText.length - rightText.length;
    });

    return results.slice(0, 8);
  }, [searchQuery, sourceFacilities, isSearchFocused]);

  const filteredDoctors = useMemo(() => {
    const query = normalizeText(searchQuery);
    const routeTargetIds = new Set(routeTargets.map(t => t.id));
    const knownDoctorProfileQuery = doctorProfiles.find((profile) => normalizeText(profile) === query);

    return enrichedDoctors.filter((doc) => {
      // Keep route targets visible
      if (routeTargetIds.has(doc.id)) return true;

      const matchesQuery = (() => {
        if (!query) {
          return true;
        }

        if (knownDoctorProfileQuery) {
          return doc.entityKind === 'doctor' && normalizeText(doc.doctorProfile) === query;
        }

        return [doc.name, doc.specialty, doc.clinic, doc.address, doc.district, doc.description, ...(doc.services || [])]
          .join(' ')
          .toLowerCase()
          .includes(query);
      })();

      const matchesClinic = selectedClinic === 'all' || doc.clinic === selectedClinic;
      const matchesFacilityType = selectedFacilityType === 'all' || doc.facilityType === selectedFacilityType;
      const matchesDistrict = selectedDistrict === 'all' || doc.district === selectedDistrict;
      const matchesDoctorProfile = selectedDoctorProfile === 'all' || doc.doctorProfile === selectedDoctorProfile;
      const matchesCardDisplayMode = cardDisplayMode === 'all' || doc.entityKind === cardDisplayMode;
      const matchesOwnership = selectedOwnership === 'all' || doc.ownership === selectedOwnership;
      const matchesRating = doc.rating >= minRating;
      const matchesExperience = doc.experience >= minExperience;
      const matchesDistance = maxDistance === 0 || doc.distanceKm === null ? true : doc.distanceKm <= maxDistance;
      const matchesOpen = !openOnly || doc.openNow;
      const matchesFavorites = !favoritesOnly || doc.isFavorite;
      const matchesWeekend = !weekendOnly || doc.weekendReception;
      const matchesEvening = !eveningOnly || doc.eveningReception;
      const matchesOnline = !onlineOnly || doc.features.onlineBooking;
      const matchesWheelchair = !wheelchairOnly || doc.features.wheelchair;
      const matchesChildren = !childrenOnly || doc.features.children;
      const matchesServices = selectedServices.every((service) => doc.services.includes(service));

      return (
        matchesQuery &&
        matchesClinic &&
        matchesFacilityType &&
        matchesDistrict &&
        matchesDoctorProfile &&
        matchesCardDisplayMode &&
        matchesOwnership &&
        matchesRating &&
        matchesExperience &&
        matchesDistance &&
        matchesOpen &&
        matchesFavorites &&
        matchesWeekend &&
        matchesEvening &&
        matchesOnline &&
        matchesWheelchair &&
        matchesChildren &&
        matchesServices
      );
    });
  }, [
    enrichedDoctors,
    searchQuery,
    doctorProfiles,
    selectedFacilityType,
    selectedClinic,
    selectedDistrict,
    selectedDoctorProfile,
    cardDisplayMode,
    selectedOwnership,
    minRating,
    minExperience,
    maxDistance,
    openOnly,
    favoritesOnly,
    weekendOnly,
    eveningOnly,
    onlineOnly,
    wheelchairOnly,
    childrenOnly,
    selectedServices,
    routeTargets,
  ]);

  const sortedDoctors = useMemo(() => {
    const list = [...filteredDoctors];
    const currentDayKey = dayKeys[now.getDay()];

    const compareByRecommendation = (left, right) => {
      const leftDistance = left.distanceKm == null ? Number.POSITIVE_INFINITY : left.distanceKm;
      const rightDistance = right.distanceKm == null ? Number.POSITIVE_INFINITY : right.distanceKm;

      return (
        Number(right.openNow) - Number(left.openNow) ||
        Number(right.isFavorite) - Number(left.isFavorite) ||
        right.rating - left.rating ||
        leftDistance - rightDistance ||
        right.experience - left.experience
      );
    };

    const compareBySchedule = (left, right) => {
      const leftRange = scheduleTextToRange(left.schedule?.[currentDayKey]);
      const rightRange = scheduleTextToRange(right.schedule?.[currentDayKey]);
      const leftStart = leftRange ? leftRange.start : Number.POSITIVE_INFINITY;
      const rightStart = rightRange ? rightRange.start : Number.POSITIVE_INFINITY;

      return Number(right.openNow) - Number(left.openNow) || leftStart - rightStart || right.rating - left.rating;
    };

    const comparators = {
      recommendation: compareByRecommendation,
      rating: (left, right) => right.rating - left.rating || right.experience - left.experience,
      experience: (left, right) => right.experience - left.experience || right.rating - left.rating,
      distance: (left, right) => {
        const leftDistance = left.distanceKm == null ? Number.POSITIVE_INFINITY : left.distanceKm;
        const rightDistance = right.distanceKm == null ? Number.POSITIVE_INFINITY : right.distanceKm;

        return leftDistance - rightDistance || Number(right.openNow) - Number(left.openNow);
      },
      schedule: compareBySchedule,
      name: (left, right) => left.name.localeCompare(right.name, 'ru'),
      clinic: (left, right) => left.clinic.localeCompare(right.clinic, 'ru'),
    };

    list.sort(comparators[sortBy] || compareByRecommendation);
    return list;
  }, [filteredDoctors, now, sortBy]);

  const [visibleCount, setVisibleCount] = useState(30);

  const favoritesCount = enrichedDoctors.filter((doc) => doc.isFavorite).length;
  const openCount = enrichedDoctors.filter((doc) => doc.openNow).length;
  const ratedDoctors = enrichedDoctors.filter((doc) => doc.rating > 0);
  const averageRating = ratedDoctors.length
    ? (ratedDoctors.reduce((sum, doc) => sum + doc.rating, 0) / ratedDoctors.length).toFixed(1)
    : '—';
  const currentDateTimeLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
        .format(now)
        .replace(',', '')
        .replace('.', ''),
    [now],
  );



  const nearestOpenDoctor = useMemo(() => {
    const byDistance = [...enrichedDoctors].sort((a, b) => (a.distanceKm || Infinity) - (b.distanceKm || Infinity));
    return byDistance.find((doc) => doc.openNow) || byDistance[0] || null;
  }, [enrichedDoctors]);
  const doctorCards = useMemo(() => sortedDoctors.filter((item) => item.entityKind === 'doctor'), [sortedDoctors]);
  const facilityCards = useMemo(() => sortedDoctors.filter((item) => item.entityKind === 'facility'), [sortedDoctors]);

  useEffect(() => {
    if (targetStopsTrigger && targetStopsTrigger.length > 0 && enrichedDoctors.length > 0) {
      const foundTargets = [];
      targetStopsTrigger.forEach(stop => {
        const candidates = enrichedDoctors.filter(doc => {
          const specialtyMatch = stop.specialty
            ? (doc.specialty && doc.specialty.toLowerCase().includes(stop.specialty.toLowerCase()))
            : true;
          const clinicMatch = stop.clinic
            ? ((doc.clinic && doc.clinic.toLowerCase().includes(stop.clinic.toLowerCase())) ||
              (doc.name && doc.name.toLowerCase().includes(stop.clinic.toLowerCase())))
            : true;
          return specialtyMatch && clinicMatch;
        });

        if (candidates.length > 0) {
          const sorted = [...candidates].sort((a, b) => (a.distanceKm || Infinity) - (b.distanceKm || Infinity));
          const best = sorted.find(c => !foundTargets.some(t => t.id === c.id));
          if (best && foundTargets.length < 5) {
            foundTargets.push(best);
          }
        }
      });

      if (foundTargets.length > 0) {
        setRouteTargets(prev => {
          const merged = [...prev];
          foundTargets.forEach(ft => {
            if (merged.length < 5 && !merged.some(t => t.id === ft.id)) {
              merged.push(ft);
            }
          });
          return merged;
        });
        setRouteData(null);
        if (foundTargets[0]) {
          setFlyToTarget([foundTargets[0].lat, foundTargets[0].lng]);
        }
      }
      setTargetStopsTrigger(null);
    } else if (buildRouteTrigger && enrichedDoctors.length > 0) {
      const bestMatch = sortedDoctors.find(d => !routeTargets.some(t => t.id === d.id));
      if (bestMatch && routeTargets.length < 5) {
        setRouteTargets(prev => [...prev, bestMatch]);
        setRouteData(null);
        setFlyToTarget([bestMatch.lat, bestMatch.lng]);
      }
      setBuildRouteTrigger(false);
    }
  }, [buildRouteTrigger, targetStopsTrigger, enrichedDoctors, sortedDoctors, routeTargets]);

  // Toggle favorite status
  const toggleFavorite = useCallback((id) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  const toggleService = (service) => {
    setSelectedServices((current) => (current.includes(service) ? current.filter((item) => item !== service) : [...current, service]));
  };

  const handleRouteClick = useCallback((doc) => {
    if (activeOrigin) {
      if (routeTargets.length >= 5) {
        alert('Достигнут лимит в 5 точек для маршрута.');
        return;
      }
      setRouteTargets(prev => [...prev, doc]);
      setRouteData(null);
      // Плавный перелёт к добавленной точке
      setFlyToTarget([doc.lat, doc.lng]);
    } else {
      alert('Точка отправления не найдена!');
    }
  }, [activeOrigin, routeTargets]);

  const handleGoToNearest = () => {
    if (!nearestOpenDoctor) return;
    // Сбрасываем фильтры, чтобы маршрут строился к реально ближайшей
    setRouteTargets([nearestOpenDoctor]);
    setRouteData(null);
    setIsFollowingUser(false);
    setFlyToTarget([nearestOpenDoctor.lat, nearestOpenDoctor.lng]);
  };

  const stableSetRouteData = useCallback((data) => {
    setRouteData(data);
  }, []);

  const clearRoute = useCallback(() => {
    setRouteTargets([]);
    setRouteData(null);
    setIsRoutePanelCollapsed(false);
    setIsRouteStarted(false);
  }, []);

  const removeFromRoute = useCallback((docId) => {
    setRouteTargets(prev => prev.filter(t => t.id !== docId));
    setRouteData(null);
  }, []);

  const [draggedTargetIndex, setDraggedTargetIndex] = useState(null);

  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, idx) => {
    e.dataTransfer.setData('text/plain', idx.toString());
    setDraggedTargetIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedTargetIndex !== null && draggedTargetIndex !== idx) {
      setDragOverIndex(idx);
    }
  };

  const handleDrop = (e, idx) => {
    e.preventDefault();
    const sourceIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);

    if (isNaN(sourceIdx) || sourceIdx === idx) {
      setDragOverIndex(null);
      return;
    }

    setRouteTargets(prev => {
      const newTargets = [...prev];
      const [movedItem] = newTargets.splice(sourceIdx, 1);
      newTargets.splice(idx, 0, movedItem);
      return newTargets;
    });

    setRouteData(null);
    setDraggedTargetIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedTargetIndex(null);
    setDragOverIndex(null);
  };

  // Touch-friendly: move route target up/down by index
  const moveRouteTarget = useCallback((fromIdx, toIdx) => {
    setRouteTargets(prev => {
      if (toIdx < 0 || toIdx >= prev.length) return prev;
      const newTargets = [...prev];
      const [moved] = newTargets.splice(fromIdx, 1);
      newTargets.splice(toIdx, 0, moved);
      return newTargets;
    });
    setRouteData(null);
  }, []);

  const markerNodes = useMemo(
    () =>
      sortedDoctors.map((doc) => {
        // Когда маршрут активен — показываем ТОЛЬКО точки маршрута
        const hasActiveRoute = routeTargets.length > 0;
        const routeIndex = routeTargets.findIndex(t => t.id === doc.id);
        const isRouteTarget = routeIndex !== -1;

        // Если пользователь нажал "Начать маршрут" — скрываем все остальные маркеры
        if (isRouteStarted && !isRouteTarget) {
          return null;
        }

        // Если маршрут не начат (или вообще не строится) — применяем обычный фильтр по типу карточки
        if (!isRouteStarted && cardDisplayMode !== 'all' && doc.entityKind !== cardDisplayMode) {
          return null;
        }
        const isGovernment = /государ/i.test(String(doc.ownership || ''));
        const ownershipIcon = isGovernment ? blueArrowIcon : violetArrowIcon;

        // Генерируем иконку с номером, если это точка маршрута
        const icon = isRouteTarget
          ? createBeautifulArrow('#ef4444', false, (routeIndex + 1).toString())
          : doc.isFavorite ? amberArrowIcon : ownershipIcon;

        const popupRouteButtonClasses = isRouteTarget
          ? 'mt-3 w-full text-sm font-medium py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all bg-red-50 text-red-600 border border-red-200'
          : 'mt-3 w-full text-sm font-medium py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800';

        return (
          <Marker key={doc.id} position={[doc.lat, doc.lng]} icon={icon}>
            <Popup>
              <div className="min-w-[220px] pb-1 dark:text-white">
                <strong className="mb-1 block text-xl leading-tight text-blue-600 dark:text-blue-400">{doc.clinic}</strong>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{doc.specialty}</span>
                <br />
                <span className="text-base text-slate-800 dark:text-white">{doc.name}</span>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className={`rounded-full px-2 py-1 font-semibold ${doc.openNow ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {doc.openNow ? 'Открыто' : 'Закрыто'}
                  </span>
                  <span className={`rounded-full px-2 py-1 font-semibold ${isGovernment ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200'}`}>
                    {doc.ownership || 'Не указано'}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{doc.district}</span>
                </div>
                <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">Сегодня: {doc.todayHours}</div>
                <button
                  type="button"
                  onClick={() => (isRouteTarget ? removeFromRoute(doc.id) : handleRouteClick(doc))}
                  className={popupRouteButtonClasses}
                >
                  {isRouteTarget ? <XCircle size={16} /> : <Navigation size={16} />} {isRouteTarget ? 'Убрать из маршрута' : 'Добавить в маршрут'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(doc.id)}
                  className={`mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${doc.isFavorite ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-200' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}
                >
                  {doc.isFavorite ? <Heart size={16} fill="currentColor" /> : <HeartOff size={16} />} {doc.isFavorite ? 'В избранном' : 'В избранное'}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      }),
    [sortedDoctors, routeTargets, cardDisplayMode, isRouteStarted, removeFromRoute, handleRouteClick, toggleFavorite],
  );

  const resetToGPS = () => {
    setIsManualOrigin(false);
    setCustomOrigin(null);
    setIsFollowingUser(true); // Включаем для синей иконки кнопки
    setRouteData(null);
    // Плавный перелёт к текущему местоположению
    setFlyToTarget(userLocation);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
    setSelectedFacilityType('all');
    setSelectedClinic('all');
    setSelectedDistrict('all');
    setSelectedDoctorProfile('all');
    setSelectedOwnership('all');
    setCardDisplayMode('all');
    setSelectedServices([]);
    setFavoritesOnly(false);
    setOpenOnly(false);
    setWeekendOnly(false);
    setEveningOnly(false);
    setOnlineOnly(false);
    setWheelchairOnly(false);
    setChildrenOnly(false);
    setMinRating(0);
    setMinExperience(0);
    setMaxDistance(0);
    setSortBy('recommendation');
    setVisibleCount(30);
  };

  const handleSearchSuggestionSelect = (value) => {
    setSearchQuery(value);
    setIsSearchFocused(false);
  };

  const handleMobileSheetTouchStart = (event) => {
    if (!isMobile) {
      return;
    }
    mobileSheetTouchStartYRef.current = event.touches[0].clientY;
  };

  const handleMobileSheetTouchMove = (event) => {
    if (!isMobile || mobileSheetTouchStartYRef.current == null) {
      return;
    }

    const currentY = event.touches[0].clientY;
    const delta = Math.max(0, currentY - mobileSheetTouchStartYRef.current);
    setMobileSheetDragOffset(delta);
  };

  const handleMobileSheetTouchEnd = () => {
    if (!isMobile) {
      return;
    }

    if (mobileSheetDragOffset > 90) {
      setIsMobileFiltersOpen(false);
    }

    mobileSheetTouchStartYRef.current = null;
    setMobileSheetDragOffset(0);
  };

  // Mouse support for drag handle (desktop testing)
  const handleMobileSheetMouseDown = (event) => {
    if (!isMobile) return;
    mobileSheetTouchStartYRef.current = event.clientY;
    const onMouseMove = (e) => {
      if (mobileSheetTouchStartYRef.current == null) return;
      const delta = Math.max(0, e.clientY - mobileSheetTouchStartYRef.current);
      setMobileSheetDragOffset(delta);
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      handleMobileSheetTouchEnd();
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const renderRouteButton = (doc, isPopup = false) => {
    const isTarget = routeTargets.some(t => t.id === doc.id);
    const commonClasses = isPopup
      ? 'mt-3 w-full text-sm font-medium py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all'
      : 'w-full flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-medium px-5 py-2.5 rounded-xl inline-flex items-center justify-center gap-2.5 transition-all border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-700 dark:hover:text-blue-100';

    const redClasses = isPopup
      ? `${commonClasses} bg-red-50 text-red-600 border border-red-200`
      : `${commonClasses} bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-700 dark:hover:text-red-100 dark:border-red-800`;

    if (isTarget) {
      return (
        <button type="button" onClick={() => removeFromRoute(doc.id)} className={redClasses}>
          <XCircle size={isPopup ? 16 : 18} /> {isPopup ? 'Убрать' : 'Убрать из маршрута'}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleRouteClick(doc)}
        className={isPopup ? `${commonClasses} bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800` : commonClasses}
      >
        <Navigation size={isPopup ? 16 : 18} /> {isPopup ? 'Показать путь' : 'Добавить в маршрут'}
      </button>
    );
  };

  const renderListingCard = (doc) => {
    const isTarget = routeTargets.some(t => t.id === doc.id);
    const isDoctorCard = doc.entityKind === 'doctor';
    const distanceLabel = doc.distanceKm == null ? 'Геолокация недоступна' : formatDistance(doc.distanceKm * 1000);
    const hasVisibleDescription = Boolean((doc.description || '').trim()) && !/данные из openstreetmap/i.test(String(doc.description));

    return (
      <div
        key={doc.id}
        className={`card-fade-in rounded-2xl sm:rounded-3xl border bg-white p-3 sm:p-5 shadow-sm transition-all dark:bg-slate-800 dark:text-white ${isTarget ? 'border-blue-400 ring-2 ring-blue-100 dark:border-blue-500 dark:ring-blue-900' : isDoctorCard ? 'border-blue-100 hover:shadow-md dark:border-blue-900' : 'border-emerald-100 hover:shadow-md dark:border-emerald-900'
          }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{doc.name}</h3>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${isDoctorCard ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100'}`}>
                {isDoctorCard ? 'Врач' : 'Учреждение'}
              </span>
              {doc.openNow ? (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100">
                  Открыто сейчас
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                  Закрыто
                </span>
              )}
            </div>
            <p className="break-words text-sm font-semibold text-blue-600 dark:text-blue-400">{isDoctorCard ? doc.doctorProfile || doc.specialty : doc.facilityType || doc.specialty}</p>
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(doc.id)}
            className={`rounded-full border p-2 transition-all ${doc.isFavorite ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-300' : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}
            title={doc.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            {doc.isFavorite ? <Heart size={18} fill="currentColor" /> : <HeartOff size={18} />}
          </button>
        </div>

        {/* Trust badges */}
        {doc.trustBadges && doc.trustBadges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {doc.trustBadges.slice(0, 3).map((badge) => (
              <span key={badge} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-200">
                ⭐ {badge}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-300">
          <div className="flex items-center gap-2">
            {isDoctorCard ? <UserRound size={16} className="shrink-0 text-slate-400 dark:text-slate-500" /> : <Hospital size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />}
            <span className="break-words">{doc.clinic}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="break-words">{doc.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />
            <span>Сегодня: {doc.todayHours}</span>
          </div>
          <div className="flex items-center gap-2">
            {isDoctorCard ? <TrendingUp size={16} className="shrink-0 text-slate-400 dark:text-slate-500" /> : <Building2 size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />}
            <span>{isDoctorCard ? `Стаж: ${doc.experience > 0 ? `${doc.experience} лет` : 'н/д'}` : `Тип: ${doc.facilityType || doc.specialty}`}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {isDoctorCard ? (
            doc.rating > 0 ? (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-200">
                <Star size={13} className="inline-block -translate-y-[1px]" fill="currentColor" /> {doc.rating}
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">Рейтинг: н/д</span>
            )
          ) : (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">{doc.facilityType || doc.specialty}</span>
          )}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{doc.ownership}</span>
          {doc.district && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{doc.district}</span>}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{distanceLabel}</span>
          {doc.features.onlineBooking && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">Онлайн-запись</span>}
          {doc.features.wheelchair && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">Доступная среда</span>}
          {doc.features.children && <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700 dark:bg-pink-900 dark:text-pink-200">Детский приём</span>}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(doc.services || []).map((service) => (
            <span key={service} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {service}
            </span>
          ))}
        </div>

        {hasVisibleDescription && <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{doc.description}</p>}

        <div className={`mt-4 grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {renderRouteButton(doc, false)}
          <button
            type="button"
            onClick={() => toggleFavorite(doc.id)}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-semibold transition-all ${doc.isFavorite ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-200' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'}`}
          >
            {doc.isFavorite ? <Heart size={16} fill="currentColor" /> : <HeartOff size={16} />}
            {doc.isFavorite ? 'В избранном' : 'В избранное'}
          </button>
        </div>
      </div>
    );
  };

  if (!isLocationReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f7fb] dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3 text-blue-600 dark:text-blue-400">
          <Loader2 className="animate-spin" size={48} />
          <h2 className="text-xl font-semibold">Определяем местоположение...</h2>
        </div>
      </div>
    );
  }

  const facilityFilterCount = (cardDisplayMode !== 'all' ? 1 : 0) + (selectedFacilityType !== 'all' ? 1 : 0) + (selectedOwnership !== 'all' ? 1 : 0) + (selectedClinic !== 'all' ? 1 : 0);
  const specialistFilterCount = (selectedDoctorProfile !== 'all' ? 1 : 0) + (minRating > 0 ? 1 : 0) + (minExperience > 0 ? 1 : 0);
  const locationFilterCount = (selectedDistrict !== 'all' ? 1 : 0) + (maxDistance > 0 ? 1 : 0);
  const optionsFilterCount = [weekendOnly, eveningOnly, onlineOnly, wheelchairOnly, childrenOnly].filter(Boolean).length;
  const servicesFilterCount = selectedServices.length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 font-sans dark:bg-slate-900">
      {/* Sidebar: desktop + mobile overlay panel */}
      {(!isMobile || isMobileFiltersOpen) && (
        <>
          {isMobile && (
            <div
              className="mobile-sheet-backdrop fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-[1px]"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
          )}
          <aside
            ref={sidebarRef}
            className={`${isMobile ? 'mobile-bottom-sheet' : ''} z-[1000] relative flex shrink-0 flex-col bg-white shadow-2xl overflow-hidden dark:bg-slate-800 transition-all duration-300 ease-in-out ${isSidebarCollapsed && !isMobile ? 'border-r-0' : ''} ${isMobile ? 'fixed inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-3xl' : ''}`}
            style={
              isMobile
                ? { transform: `translateY(${mobileSheetDragOffset}px)` }
                : { width: `${isTablet ? 340 : sidebarWidth}px`, marginLeft: isSidebarCollapsed ? `-${isTablet ? 340 : sidebarWidth}px` : '0px' }
            }
          >
            {!isMobile && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="absolute -right-5 top-1/2 z-[1010] flex h-16 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-xl border border-l-0 border-slate-200 bg-white shadow-[2px_0_8px_rgba(0,0,0,0.1)] transition-colors hover:bg-slate-50 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-blue-400"
              >
                {isSidebarCollapsed ? <ChevronRight size={18} strokeWidth={3} /> : <ChevronLeft size={18} strokeWidth={3} />}
              </button>
            )}
            {isMobile && (
              <div
                className="flex cursor-grab justify-center py-3 active:cursor-grabbing select-none"
                onTouchStart={handleMobileSheetTouchStart}
                onTouchMove={handleMobileSheetTouchMove}
                onTouchEnd={handleMobileSheetTouchEnd}
                onMouseDown={handleMobileSheetMouseDown}
              >
                <div className="h-1.5 w-14 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
            )}
            <div className="border-b border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    <Sparkles size={14} /> Казань
                  </div>
                  <h1 className={`flex items-center gap-2 font-black leading-none text-blue-600 dark:text-blue-400 ${isMobile ? 'text-[26px]' : isTablet ? 'text-[30px]' : 'text-[38px]'}`}>
                    <MapPin className="text-blue-500 dark:text-blue-400" size={isMobile ? 22 : 28} /> МедКарта
                  </h1>
                  {!isMobile && <p className="mt-1 max-w-sm text-[13px] leading-5 text-slate-500 dark:text-slate-400">Клиники, врачи и маршруты по Казани.</p>}
                </div>
                <div className="flex flex-col items-end gap-1 text-right text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] dark:bg-slate-700 dark:text-slate-300">Сегодня</span>
                    <button
                      type="button"
                      onClick={() => setIsDarkMode((current) => !current)}
                      title={isDarkMode ? 'Светлая тема' : 'Тёмная тема'}
                      className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400"
                    >
                      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300 mt-1">
                    <Clock size={13} /> {currentDateTimeLabel}
                  </span>
                </div>
              </div>

              {locationError && <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900 dark:text-amber-300">Геолокация недоступна. Показан центр Казани.</p>}

              <div className="relative mt-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Поиск по врачу, клинике, адресу, услуге"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <button
                  onClick={clearFilters}
                  title="Сбросить все фильтры"
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-red-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:text-red-400"
                >
                  <RefreshCcw size={18} />
                </button>
                <button
                  onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                  title={isFiltersCollapsed ? "Показать фильтры" : "Скрыть фильтры"}
                  className={`flex h-[42px] w-[42px] items-center justify-center rounded-xl border transition-colors ${!isFiltersCollapsed
                      ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:text-blue-400'
                    }`}
                >
                  <SlidersHorizontal size={18} />
                </button>

                {isSearchFocused && searchSuggestions.length > 0 && (
                  <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                    {searchSuggestions.map((item) => (
                      <button
                        key={`${item.type}-${item.value}`}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          handleSearchSuggestionSelect(item.value);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <span className="truncate">{item.value}</span>
                        <span className="ml-3 shrink-0 text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">{item.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick filter chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {quickFilterTags.map((tag) => (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => setSearchQuery(tag.value)}
                    title={`Поиск: ${tag.value}`}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsHeaderCollapsed((current) => !current)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                {isHeaderCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                {isHeaderCollapsed ? 'Показать быстрые блоки' : 'Скрыть быстрые блоки'}
              </button>

              <div className={`quick-blocks-collapse ${isHeaderCollapsed ? 'is-collapsed' : ''}`}>
                <div className="quick-blocks-collapse__inner">
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <StatTile label="Показано" value={sortedDoctors.length} tone="blue" />
                    <StatTile label="Открыто" value={openCount} tone="emerald" />
                    <StatTile label="Избранное" value={favoritesCount} tone="amber" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenOnly((current) => !current)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-1.5 text-[13px] font-semibold transition-all ${openOnly ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-100' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'}`}
                    >
                      <ShieldCheck size={16} /> Открытые сейчас
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToNearest}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-[13px] font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                    >
                      <Target size={16} /> Ближайшая открытая
                    </button>
                    <button
                      type="button"
                      onClick={() => setFavoritesOnly((current) => !current)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-1.5 text-[13px] font-semibold transition-all ${favoritesOnly ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-100' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'}`}
                    >
                      {favoritesOnly ? <Heart size={16} fill="currentColor" /> : <HeartOff size={16} />}
                      Избранные
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-4">
                <div className={`filters-collapse ${isFiltersCollapsed ? 'is-collapsed' : ''}`}>
                  <div className="filters-collapse__inner">
                    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <div className="mb-3 flex items-center justify-between gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <span className="inline-flex items-center gap-2">
                          <SlidersHorizontal size={16} /> Фильтры и сортировка
                        </span>
                      </div>
                      <div className="pt-3">
                        <div className="flex w-full gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
                          <button onClick={() => setActiveFilterTab('facility')} className={`relative whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${activeFilterTab === 'facility' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'}`}>
                            🏥 Учреждение
                            {facilityFilterCount > 0 && <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">{facilityFilterCount}</span>}
                          </button>
                          <button onClick={() => setActiveFilterTab('specialist')} className={`relative whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${activeFilterTab === 'specialist' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'}`}>
                            👨‍⚕️ Врач
                            {specialistFilterCount > 0 && <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">{specialistFilterCount}</span>}
                          </button>
                          <button onClick={() => setActiveFilterTab('location')} className={`relative whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${activeFilterTab === 'location' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'}`}>
                            📍 Локация
                            {locationFilterCount > 0 && <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">{locationFilterCount}</span>}
                          </button>
                          <button onClick={() => setActiveFilterTab('options')} className={`relative whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${activeFilterTab === 'options' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'}`}>
                            ⚡ Опции
                            {optionsFilterCount > 0 && <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">{optionsFilterCount}</span>}
                          </button>
                          <button onClick={() => setActiveFilterTab('services')} className={`relative whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${activeFilterTab === 'services' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-300'}`}>
                            📋 Услуги
                            {servicesFilterCount > 0 && <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">{servicesFilterCount}</span>}
                          </button>
                        </div>

                        <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Сортировка (активна всегда)</div>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                              <option value="recommendation">По рекомендации</option>
                              <option value="rating">По рейтингу</option>
                              <option value="experience">По стажу</option>
                              <option value="distance">По расстоянию</option>
                              <option value="schedule">По ближайшему приёму</option>
                              <option value="name">По имени врача</option>
                              <option value="clinic">По клинике</option>
                            </select>
                          </div>

                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Что ищем?</div>
                            <div className="flex flex-wrap gap-2">
                              <ToggleChip active={cardDisplayMode === 'all'} onClick={() => setCardDisplayMode('all')}>Всё вместе</ToggleChip>
                              <ToggleChip active={cardDisplayMode === 'doctor'} onClick={() => setCardDisplayMode('doctor')}>Только врачи</ToggleChip>
                              <ToggleChip active={cardDisplayMode === 'facility'} onClick={() => setCardDisplayMode('facility')}>Только учреждения</ToggleChip>
                            </div>
                          </div>

                          {activeFilterTab === 'facility' && (
                            <div className="space-y-4 card-fade-in">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <div className="mb-2 flex h-9 items-end text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Тип учреждения</div>
                                  <select value={selectedFacilityType} onChange={(e) => setSelectedFacilityType(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                                    <option value="all">Все</option>
                                    {facilityTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <div className="mb-2 flex h-9 items-end text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Форма собственности</div>
                                  <select value={selectedOwnership} onChange={(e) => setSelectedOwnership(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                                    <option value="all">Все</option>
                                    {ownerships.map((ownership) => <option key={ownership} value={ownership}>{ownership}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Конкретная клиника</div>
                                <select value={selectedClinic} onChange={(e) => setSelectedClinic(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                                  <option value="all">Любая</option>
                                  {clinics.map((clinic) => <option key={clinic} value={clinic}>{clinic}</option>)}
                                </select>
                              </div>
                            </div>
                          )}

                          {activeFilterTab === 'specialist' && (
                            <div className="space-y-4 card-fade-in">
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Специальность врача</div>
                                <select value={selectedDoctorProfile} onChange={(e) => setSelectedDoctorProfile(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                                  <option value="all">Любая</option>
                                  {doctorProfiles.map((profile) => <option key={profile} value={profile}>{profile}</option>)}
                                </select>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <label className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-slate-700">
                                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    <span>Рейтинг от {minRating.toFixed(1)}</span>
                                    <Star size={16} className="text-amber-500" fill="currentColor" />
                                  </div>
                                  <input type="range" min="0" max="5" step="0.1" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full accent-blue-600" />
                                </label>
                                <label className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-slate-700">
                                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    <span>Стаж от {minExperience} лет</span>
                                    <Gauge size={16} className="text-blue-500" />
                                  </div>
                                  <input type="range" min="0" max="30" step="1" value={minExperience} onChange={(e) => setMinExperience(Number(e.target.value))} className="w-full accent-blue-600" />
                                </label>
                              </div>
                            </div>
                          )}

                          {activeFilterTab === 'location' && (
                            <div className="space-y-4 card-fade-in">
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Район города</div>
                                <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                                  <option value="all">Любой</option>
                                  {districts.map((district) => <option key={district} value={district}>{district}</option>)}
                                </select>
                              </div>
                              <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-slate-700">
                                <div className="mb-2 flex items-start justify-between gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                  <span>Макс. расстояние от вас: {maxDistance === 0 ? 'Без ограничения' : `${maxDistance} км`}</span>
                                  <MapPin size={16} className="shrink-0 text-emerald-500 mt-0.5" />
                                </div>
                                <input type="range" min="0" max="40" step="1" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} className="w-full accent-blue-600" />
                              </div>
                            </div>
                          )}

                          {activeFilterTab === 'options' && (
                            <div className="card-fade-in">
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Дополнительные опции</div>
                              <div className="flex flex-col gap-2">
                                <ToggleChip active={weekendOnly} onClick={() => setWeekendOnly((current) => !current)}>📅 Выходные дни</ToggleChip>
                                <ToggleChip active={eveningOnly} onClick={() => setEveningOnly((current) => !current)}>🌙 Вечерний приём (после 18:00)</ToggleChip>
                                <ToggleChip active={onlineOnly} onClick={() => setOnlineOnly((current) => !current)}>🌐 Доступна онлайн-запись</ToggleChip>
                                <ToggleChip active={wheelchairOnly} onClick={() => setWheelchairOnly((current) => !current)}>♿ Доступно для инвалидов колясочников</ToggleChip>
                                <ToggleChip active={childrenOnly} onClick={() => setChildrenOnly((current) => !current)}>🧸 Оказывают услуги детям</ToggleChip>
                              </div>
                            </div>
                          )}

                          {activeFilterTab === 'services' && (
                            <div className="card-fade-in">
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Фильтр по услугам</div>
                              <div className="flex max-h-[300px] flex-wrap gap-2 overflow-y-auto pr-2 scrollbar-thin">
                                {allServices.map((service) => (
                                  <ToggleChip key={service} active={selectedServices.includes(service)} onClick={() => toggleService(service)}>
                                    {service}
                                  </ToggleChip>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <Building2 size={16} /> Результаты
                  </div>
                  <div className="space-y-2 text-sm text-slate-500">
                    <p>
                      {sortedDoctors.length} карточек из {sourceFacilities.length}
                    </p>
                    <p>Открытых сейчас: {openCount}</p>
                    <p>Средний рейтинг по базе: {averageRating}</p>
                  </div>
                </section>
              </div>

              <div className="mt-4 space-y-4">
                {sortedDoctors.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Ничего не найдено</p>
                    <p className="mt-1">Ослабьте фильтры или очистите поиск, чтобы вернуть карточки.</p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      <RefreshCcw size={16} /> Сбросить фильтры
                    </button>
                  </div>
                ) : cardDisplayMode === 'all' && doctorCards.length > 0 && facilityCards.length > 0 ? (
                  <>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700 dark:border-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                      Врачи ({doctorCards.length})
                    </div>
                    {doctorCards.slice(0, visibleCount).map(renderListingCard)}
                    {doctorCards.length > visibleCount && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + 30)}
                        className="w-full rounded-2xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                      >
                        Показать ещё ({doctorCards.length - visibleCount} врачей)
                      </button>
                    )}
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      Учреждения ({facilityCards.length})
                    </div>
                    {facilityCards.slice(0, visibleCount).map(renderListingCard)}
                    {facilityCards.length > visibleCount && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + 30)}
                        className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
                      >
                        Показать ещё ({facilityCards.length - visibleCount} учреждений)
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {sortedDoctors.slice(0, visibleCount).map(renderListingCard)}
                    {sortedDoctors.length > visibleCount && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + 30)}
                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        Показать ещё ({sortedDoctors.length - visibleCount} карточек)
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 px-4 py-6 text-center dark:border-slate-700" style={isMobile ? { paddingBottom: 'max(24px, env(safe-area-inset-bottom))' } : undefined}>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                © 2026 MedКарта Казань
              </div>
              <div className="mt-1 text-[10px] text-slate-300 dark:text-slate-600">
                Все права защищены
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Mobile bottom bar: route panel stacked above nav buttons */}
      {isMobile && !isMobileFiltersOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[999] flex flex-col">
          {/* Collapsed route pill */}
          {routeTargets.length > 0 && isRoutePanelCollapsed && (
            <div
              className="mx-3 mb-2 cursor-pointer"
              onClick={() => setIsRoutePanelCollapsed(false)}
            >
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 shadow-[0_4px_20px_rgba(59,130,246,0.35)] transition-transform active:scale-[0.98] dark:from-blue-700 dark:to-blue-600">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Navigation size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Smart-маршрут · {routeTargets.length} {routeTargets.length === 1 ? 'точка' : routeTargets.length < 5 ? 'точки' : 'точек'}</div>
                  {routeData && !routeData.error ? (
                    <div className="mt-0.5 text-[15px] font-extrabold text-white">{formatTime(routeData.time)} <span className="font-medium text-blue-200">· {formatDistance(routeData.distance)}</span></div>
                  ) : (
                    <div className="mt-0.5 text-sm font-medium text-blue-200">Построение маршрута...</div>
                  )}
                </div>
                <ChevronUp size={20} className="shrink-0 text-white/70" />
              </div>
            </div>
          )}

          {/* Expanded route panel */}
          {routeTargets.length > 0 && !isRoutePanelCollapsed && (
            <div className="mx-2 mb-2 max-h-[55vh] overflow-hidden overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
              <div className="sticky top-0 z-10 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-4 py-3 dark:border-slate-700 dark:from-slate-700 dark:to-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Smart-Маршрут</div>
                    <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-100 px-1.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">{routeTargets.length}</div>
                  </div>
                  <button type="button" onClick={() => setIsRoutePanelCollapsed(true)} className="rounded-lg p-1.5 text-slate-400 transition-colors active:bg-slate-200 dark:active:bg-slate-700">
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              <div className="px-3 py-2">
                <div className="flex flex-col gap-2">
                  {routeTargets.map((target, idx) => (
                    <div key={target.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/50 bg-white/60 p-2.5 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60">
                      {routeTargets.length > 1 && (
                        <div className="flex flex-col gap-0.5">
                          <button type="button" onClick={() => moveRouteTarget(idx, idx - 1)} disabled={idx === 0} className="rounded p-0.5 text-slate-400 disabled:opacity-20 active:bg-slate-100 dark:active:bg-slate-700">
                            <ChevronUp size={14} />
                          </button>
                          <button type="button" onClick={() => moveRouteTarget(idx, idx + 1)} disabled={idx === routeTargets.length - 1} className="rounded p-0.5 text-slate-400 disabled:opacity-20 active:bg-slate-100 dark:active:bg-slate-700">
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      )}
                      <div className="cursor-pointer flex-1 min-w-0" onClick={() => setFlyToTarget([target.lat, target.lng])}>
                        <div className="text-[13px] font-bold leading-tight text-slate-800 dark:text-white">{idx + 1}. {target.clinic || target.name}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">{target.address}</div>
                      </div>
                      <button onClick={() => removeFromRoute(target.id)} className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors active:bg-red-50 dark:active:bg-red-900/30">
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 border-y border-slate-100 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-700">
                {[
                  { id: 'driving', icon: Car },
                  { id: 'foot', icon: Footprints },
                  { id: 'bike', icon: Bike },
                ].map((mode) => (
                  <button key={mode.id} type="button" onClick={() => { setTravelMode(mode.id); setRouteData(null); }}
                    className={`flex flex-1 items-center justify-center rounded-xl py-2 transition-all ${travelMode === mode.id ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
                  >
                    <mode.icon size={20} />
                  </button>
                ))}
              </div>

              <div className="p-4 text-center">
                {routeData ? (
                  routeData.error ? (
                    <div className="text-sm font-medium text-red-500">Маршрут не найден</div>
                  ) : (
                    <>
                      <div className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">{formatTime(routeData.time)}</div>
                      <div className="mt-1 font-medium text-slate-500 dark:text-slate-400">{formatDistance(routeData.distance)}</div>
                    </>
                  )
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 opacity-60">
                    <Loader2 className="animate-spin text-slate-400" size={20} />
                    <span className="text-sm dark:text-slate-400">Строим маршрут...</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/50">
                {!isRouteStarted ? (
                  <button type="button" onClick={() => setIsRouteStarted(true)} className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors active:bg-blue-700 dark:bg-blue-600 dark:active:bg-blue-500">
                    Начать маршрут
                  </button>
                ) : (
                  <button type="button" onClick={() => setIsRouteStarted(false)} className="w-full rounded-xl bg-slate-200 py-3 font-semibold text-slate-700 transition-colors active:bg-slate-300 dark:bg-slate-600 dark:text-white dark:active:bg-slate-500">
                    Редактировать маршрут
                  </button>
                )}
                <button type="button" onClick={clearRoute} className="w-full rounded-xl border border-slate-200 bg-white py-3 font-semibold text-red-500 transition-colors active:bg-red-50 dark:border-slate-600 dark:bg-slate-800 dark:active:bg-red-900/30">
                  Очистить маршрут
                </button>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mobile-bottom-bar flex items-center justify-around px-2 py-2">
            <button type="button" onClick={() => setIsMobileFiltersOpen(true)} className="flex flex-col items-center gap-1 rounded-2xl px-5 py-2 text-blue-600 transition-all active:bg-blue-50 dark:text-blue-400 dark:active:bg-slate-700">
              <Search size={22} />
              <span className="text-[11px] font-semibold">Поиск</span>
            </button>
            <button type="button" onClick={() => setIsAIAssistantOpen(current => !current)} className="flex flex-col items-center gap-1 rounded-2xl px-5 py-2 text-violet-600 transition-all active:bg-violet-50 dark:text-violet-400 dark:active:bg-slate-700">
              <Bot size={22} />
              <span className="text-[11px] font-semibold">Помощник</span>
            </button>
            <button type="button" onClick={resetToGPS} className={`flex flex-col items-center gap-1 rounded-2xl px-5 py-2 transition-all active:bg-blue-50 dark:active:bg-slate-700 ${(isFollowingUser && !isManualOrigin) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
              <MapPin size={22} />
              <span className="text-[10px] font-semibold">Местоположение</span>
            </button>
          </div>
        </div>
      )}

      {!isMobile && !isSidebarCollapsed && (
        <div className="z-[1010] flex w-2 cursor-col-resize items-center justify-center bg-slate-200 transition-colors hover:bg-blue-400 dark:bg-slate-600" onMouseDown={() => setIsDraggingPanel(true)}>
          <div className="h-8 w-1 rounded-full bg-slate-400 transition-colors group-hover:bg-white dark:bg-slate-500 dark:group-hover:bg-slate-300" />
        </div>
      )}

      <main className="relative flex-1 bg-slate-100 dark:bg-slate-900">
        {!isMobile && routeTargets.length > 0 && isRoutePanelCollapsed && (
          <div
            className={`route-panel-slide-in absolute z-[1000] cursor-pointer ${isMobile ? 'left-3 right-3' : 'right-6 top-6'}`}
            style={isMobile ? { bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' } : undefined}
            onClick={() => setIsRoutePanelCollapsed(false)}
          >
            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 shadow-[0_4px_20px_rgba(59,130,246,0.35)] transition-transform active:scale-[0.98] dark:from-blue-700 dark:to-blue-600">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Navigation size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">Smart-маршрут · {routeTargets.length} {routeTargets.length === 1 ? 'точка' : routeTargets.length < 5 ? 'точки' : 'точек'}</div>
                {routeData && !routeData.error ? (
                  <div className="mt-0.5 text-[15px] font-extrabold text-white">{formatTime(routeData.time)} <span className="font-medium text-blue-200">· {formatDistance(routeData.distance)}</span></div>
                ) : (
                  <div className="mt-0.5 text-sm font-medium text-blue-200">Построение маршрута...</div>
                )}
              </div>
              <ChevronUp size={20} className="shrink-0 text-white/70" />
            </div>
          </div>
        )}

        {!isMobile && routeTargets.length > 0 && !isRoutePanelCollapsed && (
          <div
            className={`route-panel-slide-in absolute z-[1000] overflow-hidden border border-slate-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 ${isMobile ? 'left-2 right-2 rounded-2xl' : 'right-6 top-6 w-80 rounded-3xl'}`}
            style={isMobile ? { bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))', maxHeight: '55vh' } : undefined}
          >
            <div className={`border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white dark:border-slate-700 dark:from-slate-700 dark:to-slate-800 ${isMobile ? 'px-4 py-3' : 'px-5 py-4'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Smart-Маршрут</div>
                  <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-100 px-1.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">{routeTargets.length}</div>
                </div>
                <button type="button" onClick={() => setIsRoutePanelCollapsed(true)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-700">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Route targets list */}
            <div className={`${isMobile ? 'px-3 py-2 max-h-[30vh] overflow-y-auto' : 'px-5 py-3'}`}>
              <div className="flex flex-col gap-2">
                {routeTargets.map((target, idx) => (
                  <div
                    key={target.id}
                    {...(!isMobile ? {
                      draggable: true,
                      onDragStart: (e) => handleDragStart(e, idx),
                      onDragOver: (e) => handleDragOver(e, idx),
                      onDrop: (e) => handleDrop(e, idx),
                      onDragEnd: handleDragEnd,
                      onDragLeave: () => setDragOverIndex(null),
                    } : {})}
                    className={`flex items-center justify-between gap-2 rounded-xl p-2.5 shadow-sm border transition-all duration-200 ${
                      !isMobile && dragOverIndex === idx && draggedTargetIndex !== idx
                        ? 'border-blue-400 bg-blue-50/80 scale-[1.03] dark:bg-blue-900/30 dark:border-blue-500'
                        : !isMobile && draggedTargetIndex === idx
                          ? 'border-violet-400 bg-violet-50/60 opacity-50 scale-95 dark:bg-violet-900/30 dark:border-violet-500'
                          : 'border-white/50 bg-white/60 dark:bg-slate-800/60 dark:border-slate-700/50'
                    }`}
                  >
                    {isMobile && routeTargets.length > 1 && (
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => moveRouteTarget(idx, idx - 1)} disabled={idx === 0} className="rounded p-0.5 text-slate-400 disabled:opacity-20 active:bg-slate-100 dark:active:bg-slate-700">
                          <ChevronUp size={14} />
                        </button>
                        <button type="button" onClick={() => moveRouteTarget(idx, idx + 1)} disabled={idx === routeTargets.length - 1} className="rounded p-0.5 text-slate-400 disabled:opacity-20 active:bg-slate-100 dark:active:bg-slate-700">
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    )}
                    {!isMobile && (
                      <div className="mt-0.5 cursor-grab text-slate-400 active:cursor-grabbing">
                        <GripVertical size={16} />
                      </div>
                    )}
                    <div className="cursor-pointer flex-1 min-w-0" onClick={() => setFlyToTarget([target.lat, target.lng])}>
                      <div className="text-[13px] font-bold leading-tight text-slate-800 dark:text-white">{idx + 1}. {target.clinic || target.name}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">{target.address}</div>
                    </div>
                    <button onClick={() => removeFromRoute(target.id)} className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:text-red-500 active:bg-red-50 dark:active:bg-red-900/30">
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {isManualOrigin && (
              <div className="flex flex-col items-center border-b border-amber-100 bg-amber-50 px-4 py-2 text-center text-[13px] text-amber-700 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-300">
                <span>Маршрут от выбранной точки</span>
                <button type="button" onClick={resetToGPS} className="mt-1 font-bold underline hover:text-amber-900">
                  Вернуться к моей геопозиции
                </button>
              </div>
            )}

            <div className="flex gap-2 border-b border-slate-100 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-700">
              {[
                { id: 'driving', icon: Car },
                { id: 'foot', icon: Footprints },
                { id: 'bike', icon: Bike },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setTravelMode(mode.id);
                    setRouteData(null);
                  }}
                  className={`flex flex-1 items-center justify-center rounded-xl py-2 transition-all ${travelMode === mode.id ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400' : 'text-slate-400 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-600'}`}
                >
                  <mode.icon size={20} />
                </button>
              ))}
            </div>

            <div className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
              {routeData ? (
                routeData.error ? (
                  <div className="text-sm font-medium text-red-500">Маршрут для этого транспорта не найден</div>
                ) : (
                  <>
                    <div className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-extrabold tracking-tight text-slate-800 dark:text-white`}>{formatTime(routeData.time)}</div>
                    <div className="mt-1 font-medium text-slate-500 dark:text-slate-400">{formatDistance(routeData.distance)}</div>
                  </>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-2 opacity-60">
                  <Loader2 className="mb-2 animate-spin text-slate-400 dark:text-slate-500" size={24} />
                  <span className="text-sm dark:text-slate-400">Строим маршрут...</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/50">
              {!isRouteStarted ? (
                <button type="button" onClick={() => setIsRouteStarted(true)} className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500">
                  Начать маршрут
                </button>
              ) : (
                <button type="button" onClick={() => setIsRouteStarted(false)} className="w-full rounded-xl bg-slate-200 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500">
                  Редактировать маршрут
                </button>
              )}
              <button type="button" onClick={clearRoute} className="w-full rounded-xl border border-slate-200 bg-white py-3 font-semibold text-red-500 transition-colors hover:bg-red-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-red-900/30">
                Очистить весь маршрут
              </button>
            </div>
          </div>
        )}

        <MapContainer center={activeOrigin} zoom={13} className="h-full w-full" zoomControl attributionControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker
            position={activeOrigin}
            icon={userDotIcon}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const marker = event.target;
                const position = marker.getLatLng();
                setCustomOrigin([position.lat, position.lng]);
                setIsManualOrigin(true);
                setIsFollowingUser(false);
                setRouteData(null);
              },
            }}
          >
            <Popup>
              <div className="dark:text-white">
                <b className="text-base text-red-600">{isManualOrigin ? 'Произвольная точка отправления' : 'Вы здесь'}</b>
                <br />
                <span className="mt-1 block text-xs leading-tight text-slate-500">Перетащите эту точку, чтобы изменить старт маршрута</span>
              </div>
            </Popup>
          </Marker>

          <MarkerClusterGroup disableClusteringAtZoom={16}>
            {markerNodes}
          </MarkerClusterGroup>

          <RoutingMachine originLocation={activeOrigin} routeTargets={routeTargets} travelMode={travelMode} setRouteData={stableSetRouteData} />
          <InvalidateMapSize />

          <InitialCenterMap location={userLocation} />
          {flyToTarget && <FlyToPoint target={flyToTarget} onDone={() => setFlyToTarget(null)} />}
        </MapContainer>

        {/* Кнопки на карте — скрываем на мобильных (есть bottom bar) */}
        {!isMobile && (
          <>
            <button
              type="button"
              onClick={resetToGPS}
              className={`absolute bottom-6 right-6 z-[1000] rounded-full border-2 p-3 shadow-lg transition-all ${(isFollowingUser && !isManualOrigin) ? 'border-blue-700 bg-blue-600 text-white hover:bg-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'}`}
              title="Вернуться к моему местоположению"
            >
              <MapPin size={24} />
            </button>

            <button
              type="button"
              onClick={() => setIsAIAssistantOpen(current => !current)}
              className="absolute bottom-[88px] right-6 z-[1000] rounded-full bg-violet-600 p-3 text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] transition-all hover:scale-105 hover:bg-violet-700"
              title="AI-Ассистент"
            >
              <Bot size={24} />
            </button>
          </>
        )}

        <AIAssistant 
          isOpen={isAIAssistantOpen} 
          onClose={() => setIsAIAssistantOpen(false)} 
          onApplyTriage={handleApplyTriage}
          isMobile={isMobile}
        />
      </main>
    </div>
  );
}