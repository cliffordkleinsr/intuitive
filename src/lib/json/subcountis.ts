// Type for a single county's data
type SubCounties = string[];

// Type for the entire Kenya data object
type KenyaData = {
	[county: string]: SubCounties;
};

// Type for the Map structure
type CountyMap = Map<string, SubCounties>;
const kenyaData: KenyaData = {
	Mombasa: ['Changamwe', 'Jomvu', 'Kisauni', 'Likoni', 'Mvita', 'Nyali'],
	Kwale: ['Kinango', 'Lunga Lunga', 'Matuga', 'Msambweni'],
	Kilifi: ['Ganze', 'Kaloleni', 'Kilifi North', 'Kilifi South', 'Magarini', 'Malindi', 'Rabai'],
	'Tana River': ['Bura', 'Galole', 'Garsen'],
	Lamu: ['Lamu East', 'Lamu West'],
	'Taita-Taveta': ['Mwatate', 'Taveta', 'Voi', 'Wundanyi'],
	Garissa: ['Balambala', 'Dadaab', 'Fafi', 'Garissa Township', 'Ijara', 'Lagdera'],
	Wajir: ['Eldas', 'Tarbaj', 'Wajir East', 'Wajir North', 'Wajir South', 'Wajir West'],
	Mandera: ['Banissa', 'Lafey', 'Mandera East', 'Mandera North', 'Mandera South', 'Mandera West'],
	Marsabit: ['Laisamis', 'Moyale', 'North Horr', 'Saku'],
	Isiolo: ['Garbatulla', 'Isiolo', 'Merti'],
	Meru: [
		'Buuri',
		'Igembe Central',
		'Igembe North',
		'Igembe South',
		'Imenti Central',
		'Imenti North',
		'Imenti South',
		'Tigania East',
		'Tigania West'
	],
	'Tharaka Nithi': ["Chuka/Igambang'ombe", 'Maara', 'Tharaka'],
	Embu: ['Manyatta', 'Mbeere North', 'Mbeere South', 'Runyenjes'],
	Kitui: [
		'Kitui Central',
		'Kitui East',
		'Kitui Rural',
		'Kitui South',
		'Kitui West',
		'Mwingi Central',
		'Mwingi North',
		'Mwingi West'
	],
	Machakos: ['Kathiani', 'Machakos Town', 'Masinga', 'Matungulu', 'Mavoko', 'Mwala', 'Yatta'],
	Makueni: ['Kaiti', 'Kibwezi East', 'Kibwezi West', 'Kilome', 'Makueni', 'Mbooni'],
	Nyandarua: ['Kinangop', 'Kipipiri', 'Ndaragwa', 'Ol Kalou', 'Ol Joro Orok'],
	Nyeri: ['Kieni', 'Mathira', 'Mukurweini', 'Nyeri Town', 'Othaya', 'Tetu'],
	Kirinyaga: ['Gichugu', 'Kirinyaga Central', 'Mwea', 'Ndia'],
	"Murang'a": ['Gatanga', 'Kandara', 'Kangema', 'Kigumo', 'Kiharu', 'Mathioya', 'Maragwa'],
	Kiambu: [
		'Gatundu North',
		'Gatundu South',
		'Githunguri',
		'Juja',
		'Kabete',
		'Kiambaa',
		'Kiambu',
		'Kikuyu',
		'Limuru',
		'Ruiru',
		'Thika Town',
		'Lari'
	],
	Turkana: [
		'Kibish',
		'Loima',
		'Turkana Central',
		'Turkana East',
		'Turkana North',
		'Turkana South',
		'Turkana West'
	],
	'West Pokot': ['Kacheliba', 'Kapenguria', 'Pokot South', 'Sigor'],
	Samburu: ['Samburu East', 'Samburu North', 'Samburu West'],
	'Trans Nzoia': ['Cherangany', 'Endebess', 'Kiminini', 'Kwanza', 'Saboti'],
	'Uasin Gishu': ['Ainabkoi', 'Kapseret', 'Kesses', 'Moiben', 'Soy', 'Turbo'],
	'Elgeyo Marakwet': ['Keiyo North', 'Keiyo South', 'Marakwet East', 'Marakwet West'],
	Nandi: ['Aldai', 'Chesumei', 'Emgwen', 'Mosop', 'Nandi Hills', 'Tinderet'],
	Baringo: [
		'Baringo Central',
		'Baringo North',
		'Baringo South',
		'Eldama Ravine',
		'Mogotio',
		'Tiaty'
	],
	Laikipia: ['Laikipia Central', 'Laikipia East', 'Laikipia North', 'Laikipia West', 'Nyahururu'],
	Nakuru: [
		'Bahati',
		'Gilgil',
		'Kuresoi North',
		'Kuresoi South',
		'Molo',
		'Naivasha',
		'Nakuru Town East',
		'Nakuru Town West',
		'Njoro',
		'Rongai',
		'Subukia'
	],
	Narok: [
		'Narok East',
		'Narok North',
		'Narok South',
		'Narok West',
		'Transmara East',
		'Transmara West'
	],
	Kajiado: ['Kajiado Central', 'Kajiado East', 'Kajiado North', 'Kajiado South', 'Kajiado West'],
	Kericho: ['Ainamoi', 'Belgut', 'Bureti', 'Kipkelion East', 'Kipkelion West', 'Sigowet/Soin'],
	Bomet: ['Bomet Central', 'Bomet East', 'Chepalungu', 'Konoin', 'Sotik'],
	Kakamega: [
		'Butere',
		'Ikolomani',
		'Khwisero',
		'Likuyani',
		'Lugari',
		'Lurambi',
		'Malava',
		'Matungu',
		'Mumias East',
		'Mumias West',
		'Navakholo',
		'Shinyalu'
	],
	Vihiga: ['Emuhaya', 'Hamisi', 'Luanda', 'Sabatia', 'Vihiga'],
	Bungoma: [
		'Bumula',
		'Kabuchai',
		'Kanduyi',
		'Kimilili',
		'Mt. Elgon',
		'Sirisia',
		'Tongaren',
		'Webuye East',
		'Webuye West'
	],
	Busia: ['Budalangi', 'Butula', 'Funyula', 'Nambale', 'Teso North', 'Teso South', 'Matayos'],
	Siaya: ['Alego Usonga', 'Bondo', 'Gem', 'Rarieda', 'Ugenya', 'Ugunja'],
	Kisumu: ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Muhoroni', 'Nyakach', 'Nyando', 'Seme'],
	'Homa Bay': [
		'Homa Bay Town',
		'Kabondo Kasipul',
		'Karachuonyo',
		'Kasipul',
		'Mbita',
		'Ndhiwa',
		'Rangwe',
		'Suba North'
	],
	Migori: [
		'Awendo',
		'Kuria East',
		'Kuria West',
		'Nyatike',
		'Rongo',
		'Suna East',
		'Suna West',
		'Uriri'
	],
	Kisii: [
		'Bobasi',
		'Bonchari',
		'Bomachoge Borabu',
		'Bomachoge Chache',
		'Kitutu Chache North',
		'Kitutu Chache South',
		'Nyaribari Chache',
		'Nyaribari Masaba',
		'South Mugirango'
	],
	Nyamira: ['Borabu', 'Kitutu Masaba', 'North Mugirango', 'West Mugirango'],
	Nairobi: [
		'Dagoretti North',
		'Dagoretti South',
		'Embakasi Central',
		'Embakasi East',
		'Embakasi North',
		'Embakasi South',
		'Embakasi West',
		'Kamukunji',
		'Kasarani',
		'Kibra',
		"Lang'ata",
		'Makadara',
		'Mathare',
		'Roysambu',
		'Ruaraka',
		'Starehe',
		'Westlands'
	]
};
const countyMap = new Map();

// Append the data to the Map
for (const [county, subCounties] of Object.entries(kenyaData)) {
	countyMap.set(county, subCounties);
}

export { countyMap };
