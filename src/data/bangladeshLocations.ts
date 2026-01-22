export const districts = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet", "Rangpur", "Barisal", "Mymensingh",
  "Comilla", "Gazipur", "Narayanganj", "Tangail", "Bogra", "Jessore", "Cox's Bazar",
  "Dinajpur", "Brahmanbaria", "Narsingdi", "Savar", "Tongi", "Faridpur", "Gopalganj",
  "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur"
];

export const thanas: Record<string, string[]> = {
  "Dhaka": [
    "Adabar", "Badda", "Banani", "Bangshal", "Bimanbandar", "Cantonment", "Chawkbazar",
    "Darus Salam", "Demra", "Dhanmondi", "Gulshan", "Hazaribagh", "Jatrabari", "Kadamtali",
    "Kafrul", "Kalabagan", "Kamrangirchar", "Khilgaon", "Khilkhet", "Kotwali", "Lalbagh",
    "Mirpur", "Mohammadpur", "Motijheel", "New Market", "Pallabi", "Paltan", "Ramna",
    "Rampura", "Sabujbagh", "Shah Ali", "Shahbag", "Sher-e-Bangla Nagar", "Shyampur",
    "Sutrapur", "Tejgaon", "Turag", "Uttara", "Uttarkhan", "Vatara", "Wari"
  ],
  "Chittagong": [
    "Akbarshah", "Bakalia", "Bandar", "Bayazid Bostami", "Chandgaon", "Double Mooring",
    "EPZ", "Halishahar", "Karnaphuli", "Khulshi", "Kotwali", "Pahartali", "Panchlaish",
    "Patenga", "Sadarghat"
  ],
  "Rajshahi": [
    "Boalia", "Godagari", "Motihar", "Paba", "Rajpara", "Shah Makhdum", "Tanore"
  ],
  "Khulna": [
    "Daulatpur", "Dumuria", "Khan Jahan Ali", "Khalishpur", "Kotwali", "Sonadanga"
  ],
  "Sylhet": [
    "Airport", "Dakshin Surma", "Jalalabad", "Kotwali", "Moglabazar", "Shah Poran"
  ],
  "Rangpur": [
    "Gangachara", "Kaunia", "Kotwali", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"
  ],
  "Barisal": [
    "Airport", "Bandar", "Kotwali", "Kawnia"
  ],
  "Mymensingh": [
    "Kotwali", "Muktagachha", "Trishal"
  ],
  "Comilla": ["Adarsha Sadar", "Kotwali", "Laksham"],
  "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur", "Tongi"],
  "Narayanganj": ["Araihazar", "Bandar", "Fatullah", "Narayanganj Sadar", "Rupganj", "Siddhirganj", "Sonargaon"],
};

// Default thanas for districts not explicitly listed
export const getThanas = (district: string): string[] => {
  return thanas[district] || ["Sadar", "City Center"];
};
