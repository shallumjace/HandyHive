import AsyncStorage from '@react-native-async-storage/async-storage';

// ==========================================
// SECTION 1: SYSTEM SEED STORAGE KEYS
// ==========================================
const KEYS = {
  ADMINS: 'HH_STORAGE_ADMINS',
  CLIENTS: 'HH_STORAGE_CLIENTS',
  WORKERS: 'HH_STORAGE_WORKERS',
  CATEGORIES: 'HH_STORAGE_CATEGORIES',
  BOOKINGS: 'HH_STORAGE_BOOKINGS',
}; 

// ==========================================
// SECTION 2: INITIAL SYSTEM DATA PACKS (SEED DATA)
// ==========================================


//the following names and other personal information are fictional and any resemblance to real persons, living or dead, is purely coincidental.
const INITIAL_ADMINS = [
  { id: 'admin1', name: 'Super Admin', email: 'admin1@hive.com', password: 'password123', role: 'Admin' },
  { id: 'admin2', name: 'System Manager', email: 'admin2@hive.com', password: 'password123', role: 'Admin' }
];

const INITIAL_CLIENTS = [
  { id: 'client1', name: 'Jane Doe', email: 'jane.doe@hive.com', password: 'password123', sex: 'Female', age: 28, birthday: '1998-05-12', phone: '0917 123 4567', role: 'Client' },
  { id: 'client2', name: 'John Smith', email: 'john.smith@hive.com', password: 'password123', sex: 'Male', age: 34, birthday: '1992-08-22', phone: '0918 234 5678', role: 'Client' },
  { id: 'client3', name: 'Maria Clara', email: 'maria.c@hive.com', password: 'password123', sex: 'Female', age: 24, birthday: '2002-02-14', phone: '0919 345 6789', role: 'Client' },
  { id: 'client4', name: 'Crisostomo Ibarra', email: 'ibarra.c@hive.com', password: 'password123', sex: 'Male', age: 27, birthday: '1999-10-25', phone: '0920 456 7890', role: 'Client' },
  { id: 'client5', name: 'Sarah Geronimo', email: 'sarah.g@hive.com', password: 'password123', sex: 'Female', age: 31, birthday: '1995-07-25', phone: '0921 567 8901', role: 'Client' }
];

const INITIAL_CATEGORIES = ['Welding', 'Cleaning', 'Plumbing', 'Electrical', 'Tutoring', 'Carpentry'];

const INITIAL_WORKERS = [
  // --- PLUMBING SPECIALISTS ---
  { id: 'worker1', name: 'Juan Dela Cruz', email: 'juan.dc@worker.com', password: 'password123', sex: 'Male', age: 35, birthday: '1991-04-10', phone: '0931 111 0001', specialty: 'Plumbing', rate: '₱300/hr', bio: 'Expert in residential pipe mapping and emergency patch services.', certificate: 'NCII Certified Plumber', role: 'Worker' },
  { id: 'worker2', name: 'Pedro Reyes', email: 'pedro.r@worker.com', password: 'password123', sex: 'Male', age: 40, birthday: '1986-11-15', phone: '0931 111 0002', specialty: 'Plumbing', rate: '₱300/hr', bio: 'Commercial systems and leak maintenance diagnostics veteran.', certificate: 'NCII Certified Plumber', role: 'Worker' },
  { id: 'worker3', name: 'Ricky Salvador', email: 'ricky.s@worker.com', password: 'password123', sex: 'Male', age: 29, birthday: '1997-09-05', phone: '0931 111 0003', specialty: 'Plumbing', rate: '₱300/hr', bio: 'Friendly neighborhood professional specializing in fast fixture replacements.', certificate: 'NCII Certified Plumber', role: 'Worker' },
  { id: 'worker4', name: 'Gilbert Santos', email: 'gilbert.s@worker.com', password: 'password123', sex: 'Male', age: 33, birthday: '1993-02-28', phone: '0931 111 0004', specialty: 'Plumbing', rate: '₱300/hr', bio: 'Drain cleaning, clogs, and high pressure system adjustments specialist.', certificate: 'NCII Certified Plumber', role: 'Worker' },
  { id: 'worker5', name: 'Michael Pangilinan', email: 'mike.p@worker.com', password: 'password123', sex: 'Male', age: 38, birthday: '1988-06-18', phone: '0931 111 0005', specialty: 'Plumbing', rate: '₱300/hr', bio: 'Water heater configurations and complete bathroom installations.', certificate: 'NCII Certified Plumber', role: 'Worker' },

  // --- CLEANING SPECIALISTS ---
  { id: 'worker6', name: 'Maria Santos', email: 'maria.s@worker.com', password: 'password123', sex: 'Female', age: 26, birthday: '2000-01-20', phone: '0932 222 0001', specialty: 'Cleaning', rate: '₱300/hr', bio: 'Deep disinfection, corporate environments, and house management layouts.', certificate: 'NCII Housekeeping Certified', role: 'Worker' },
  { id: 'worker7', name: 'Ana Gomez', email: 'ana.g@worker.com', password: 'password123', sex: 'Female', age: 30, birthday: '1996-03-14', phone: '0932 222 0002', specialty: 'Cleaning', rate: '₱300/hr', bio: 'Eco-friendly appliance cleanups and detailed moving-out sanities.', certificate: 'NCII Housekeeping Certified', role: 'Worker' },
  { id: 'worker8', name: 'Elena Roxas', email: 'elena.r@worker.com', password: 'password123', sex: 'Female', age: 32, birthday: '1994-12-05', phone: '0932 222 0003', specialty: 'Cleaning', rate: '₱300/hr', bio: 'Specialist in post-construction cleanings and detailed carpet care.', certificate: 'NCII Housekeeping Certified', role: 'Worker' },
  { id: 'worker9', name: 'Divina Garcia', email: 'divina.g@worker.com', password: 'password123', sex: 'Female', age: 27, birthday: '1999-07-11', phone: '0932 222 0004', specialty: 'Cleaning', rate: '₱300/hr', bio: 'Meticulous disinfection and apartment turnover preparation specialist.', certificate: 'NCII Housekeeping Certified', role: 'Worker' },
  { id: 'worker10', name: 'Clara Benson', email: 'clara.b@worker.com', password: 'password123', sex: 'Female', age: 35, birthday: '1991-10-30', phone: '0932 222 0005', specialty: 'Cleaning', rate: '₱300/hr', bio: 'Upholstery maintenance, premium stain extraction, and floor waxing.', certificate: 'NCII Housekeeping Certified', role: 'Worker' },

  // --- WELDING SPECIALISTS ---
  { id: 'worker11', name: 'Fred Silva', email: 'fred.s@worker.com', password: 'password123', sex: 'Male', age: 42, birthday: '1984-05-24', phone: '0933 333 0001', specialty: 'Welding', rate: '₱300/hr', bio: 'Structural steel fabrication, gate designs, and heavy iron reinforcements.', certificate: 'NCII Welder (SMAW)', role: 'Worker' },
  { id: 'worker12', name: 'Greg Ramos', email: 'greg.r@worker.com', password: 'password123', sex: 'Male', age: 31, birthday: '1995-08-19', phone: '0933 333 0002', specialty: 'Welding', rate: '₱300/hr', bio: 'Custom structural modifications, automotive frame restorations, and fences.', certificate: 'NCII Welder (SMAW)', role: 'Worker' },
  { id: 'worker13', name: 'Henry Santos', email: 'henry.s@worker.com', password: 'password123', sex: 'Male', age: 28, birthday: '1998-11-02', phone: '0933 333 0003', specialty: 'Welding', rate: '₱300/hr', bio: 'Precision repairs on metal frameworks, grilles, and secure hinges.', certificate: 'NCII Welder (GMAW)', role: 'Worker' },
  { id: 'worker14', name: 'Jessie Vargas', email: 'jessie.v@worker.com', password: 'password123', sex: 'Male', age: 36, birthday: '1990-03-12', phone: '0933 333 0004', specialty: 'Welding', rate: '₱300/hr', bio: 'Heavy machinery patching, gate track assemblies, and custom metal craft.', certificate: 'NCII Welder (SMAW)', role: 'Worker' },
  { id: 'worker15', name: 'Oscar Madrigal', email: 'oscar.m@worker.com', password: 'password123', sex: 'Male', age: 45, birthday: '1981-01-15', phone: '0933 333 0005', specialty: 'Welding', rate: '₱300/hr', bio: 'Industrial grade structural reinforcements and detailed arc welding.', certificate: 'NCII Welder (GTAW)', role: 'Worker' },

  // --- ELECTRICAL SPECIALISTS ---
  { id: 'worker16', name: 'Mark Castro', email: 'mark.c@worker.com', password: 'password123', sex: 'Male', age: 30, birthday: '1996-06-25', phone: '0934 444 0001', specialty: 'Electrical', rate: '₱300/hr', bio: 'Residential breaker panels, system wiring upgrades, and outlet safety checks.', certificate: 'NCII Electrical Installation', role: 'Worker' },
  { id: 'worker17', name: 'Paul Cruz', email: 'paul.c@worker.com', password: 'password123', sex: 'Male', age: 34, birthday: '1992-09-09', phone: '0934 444 0002', specialty: 'Electrical', rate: '₱300/hr', bio: 'Lighting controls, circuit tracing, and safe utility configurations.', certificate: 'NCII Electrical Installation', role: 'Worker' },
  { id: 'worker18', name: 'Leo Reyes', email: 'leo.r@worker.com', password: 'password123', sex: 'Male', age: 39, birthday: '1987-12-14', phone: '0934 444 0003', specialty: 'Electrical', rate: '₱300/hr', bio: 'Smart home setups, CCTV lines, and diagnostic short circuit troubleshooting.', certificate: 'NCII Electrical Installation', role: 'Worker' },
  { id: 'worker19', name: 'Arnel Pineda', email: 'arnel.p@worker.com', password: 'password123', sex: 'Male', age: 27, birthday: '1999-04-03', phone: '0934 444 0004', specialty: 'Electrical', rate: '₱300/hr', bio: 'Appliance power optimizations, generator switches, and lighting layouts.', certificate: 'NCII Electrical Installation', role: 'Worker' },
  { id: 'worker20', name: 'Dante Alighieri', email: 'dante.a@worker.com', password: 'password123', sex: 'Male', age: 41, birthday: '1985-07-20', phone: '0934 444 0005', specialty: 'Electrical', rate: '₱300/hr', bio: 'Full scale building wire restorations and industrial motor circuit repairs.', certificate: 'NCII Electrical Installation', role: 'Worker' },

  // --- TUTORING SPECIALISTS ---
  { id: 'worker21', name: 'Grace Diaz', email: 'grace.d@worker.com', password: 'password123', sex: 'Female', age: 25, birthday: '2001-08-11', phone: '0935 555 0001', specialty: 'Tutoring', rate: '₱300/hr', bio: 'Primary mathematics, algebra foundations, and science modules mentor.', certificate: 'Licensed Teacher Cert', role: 'Worker' },
  { id: 'worker22', name: 'Alice Torres', email: 'alice.t@worker.com', password: 'password123', sex: 'Female', age: 28, birthday: '1998-05-30', phone: '0935 555 0002', specialty: 'Tutoring', rate: '₱300/hr', bio: 'English proficiency development, reading comprehension, and writing bootcamps.', certificate: 'English Linguistics Degree', role: 'Worker' },
  { id: 'worker23', name: 'David Perez', email: 'david.p@worker.com', password: 'password123', sex: 'Male', age: 29, birthday: '1997-12-01', phone: '0935 555 0003', specialty: 'Tutoring', rate: '₱300/hr', bio: 'High school advanced calculus, statistics configurations, and physics preparation.', certificate: 'Engineering Graduate Cert', role: 'Worker' },
  { id: 'worker24', name: 'Christina Aguilera', email: 'xtina.a@worker.com', password: 'password123', sex: 'Female', age: 31, birthday: '1995-02-17', phone: '0935 555 0004', specialty: 'Tutoring', rate: '₱300/hr', bio: 'Effective reading strategies and foundation assignments coach for toddlers.', certificate: 'Early Childhood Education Cert', role: 'Worker' },
  { id: 'worker25', name: 'Noel Gardoque', email: 'noel.g@worker.com', password: 'password123', sex: 'Male', age: 35, birthday: '1991-09-22', phone: '0935 555 0005', specialty: 'Tutoring', rate: '₱300/hr', bio: 'College entrance examination crash courses and specialized chemistry reviewer.', certificate: 'Licensed Teacher Cert', role: 'Worker' },

  // --- CARPENTRY SPECIALISTS ---
  { id: 'worker26', name: 'Ian Mendoza', email: 'ian.m@worker.com', password: 'password123', sex: 'Male', age: 37, birthday: '1889-03-15', phone: '0936 666 0001', specialty: 'Carpentry', rate: '₱300/hr', bio: 'Custom cabinet creations, wood restoration layouts, and furniture adjustments.', certificate: 'NCII Carpentry Certified', role: 'Worker' },
  { id: 'worker27', name: 'Jake Aquino', email: 'jake.a@worker.com', password: 'password123', sex: 'Male', age: 33, birthday: '1993-10-10', phone: '0936 666 0002', specialty: 'Carpentry', rate: '₱300/hr', bio: 'Door rebuilding, custom window adjustments, and secure roofing frameworks.', certificate: 'NCII Carpentry Certified', role: 'Worker' },
  { id: 'worker28', name: 'Kyle Pascual', email: 'kyle.p@worker.com', password: 'password123', sex: 'Male', age: 28, birthday: '1998-04-18', phone: '0936 666 0003', specialty: 'Carpentry', rate: '₱300/hr', bio: 'Drywall setups, detailed wood finishing, and precise residential deck repairs.', certificate: 'NCII Carpentry Certified', role: 'Worker' },
  { id: 'worker29', name: 'Ramon Bautista', email: 'ramon.b@worker.com', password: 'password123', sex: 'Male', age: 44, birthday: '1982-12-01', phone: '0936 666 0004', specialty: 'Carpentry', rate: '₱300/hr', bio: 'Full framing setups, ceiling moldings, and complex structural timber replacements.', certificate: 'NCII Carpentry Master', role: 'Worker' },
  { id: 'worker30', name: 'Samuel Versoza', email: 'sam.v@worker.com', password: 'password123', sex: 'Male', age: 36, birthday: '1990-07-07', phone: '0936 666 0005', specialty: 'Carpentry', rate: '₱300/hr', bio: 'Shed design frameworks, floor panel fits, and outdoor wooden structures fencing.', certificate: 'NCII Carpentry Certified', role: 'Worker' }
];

const INITIAL_BOOKINGS = [
  {
    id: 'b1',
    clientId: 'client1',
    clientName: 'Jane Doe',
    clientPhone: '0917 123 4567',
    workerId: 'worker1',
    workerName: 'Juan Dela Cruz',
    service: 'Plumbing',
    date: 'May 24, 2026',
    time: '10:00 AM',
    location: 'Building B, Room 402, City Central',
    notes: 'Leaky kitchen faucet fix and main valve checking.',
    status: 'Upcoming' 
  }
];

// ==========================================
// SECTION 3: SYSTEM LOADER ENGINE
// ==========================================
export async function initializeDatabase() {
  try {
    const adminCheck = await AsyncStorage.getItem(KEYS.ADMINS);
    if (!adminCheck) {
      await AsyncStorage.setItem(KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
      await AsyncStorage.setItem(KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      await AsyncStorage.setItem(KEYS.WORKERS, JSON.stringify(INITIAL_WORKERS));
      await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      console.log('HandyHive Database Engine Initialized with 37 original profiles.');
    }
  } catch (error) {
    console.error('Database Engine initialization crash: ', error);
  }
}

// ==========================================
// SECTION 4: DATA RETRIEVAL CORE CORE UTILS
// ==========================================
export async function getData(key) {
  try {
    const data = await AsyncStorage.getItem(KEYS[key]);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export async function saveData(key, data) {
  try {
    await AsyncStorage.setItem(KEYS[key], JSON.stringify(data));
  } catch (e) {
    console.error(`Failed saving cluster to ${key}`);
  }
}

// ==========================================
// SECTION 5: SIGNUP COMPLIANCE & AUTO-INCREMENTS
// ==========================================
export async function registerUserInStorage(newUser) {
  const admins = await getData('ADMINS');
  const clients = await getData('CLIENTS');
  const workers = await getData('WORKERS');

  // Unified global check for unique emails
  const allUsers = [...admins, ...clients, ...workers];
  const emailExists = allUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
  
  if (emailExists) {
    throw new Error('This email address is already bound to another registered profile.');
  }

  if (newUser.role === 'Client') {
    const nextIdNumber = clients.length + 1;
    newUser.id = `client${nextIdNumber}`;
    clients.push(newUser);
    await saveData('CLIENTS', clients);
  } else if (newUser.role === 'Worker') {
    const nextIdNumber = workers.length + 1;
    newUser.id = `worker${nextIdNumber}`;
    workers.push(newUser);
    await saveData('WORKERS', workers);
  }
  return newUser;
}