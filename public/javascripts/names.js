var firstnames = [
'Jackson',
'Aiden',
'Liam',
'Lucas',
'Noah',
'Mason',
'Ethan',
'Caden',
'Jacob',
'Logan',
'Jayden',
'Elijah',
'Jack',
'Luke',
'Michael',
'Benjamin',
'Alexander',
'James',
'Jayce',
'Caleb',
'Connor',
'William',
'Carter',
'Ryan',
'Oliver',
'Matthew',
'Daniel',
'Gabriel',
'Henry',
'Owen',
'Grayson',
'Dylan',
'Landon',
'Isaac',
'Nicholas',
'Wyatt',
'Nathan',
'Andrew',
'Cameron',
'Dominic',
'Joshua',
'Eli',
'Sebastian',
'Hunter',
'Brayden',
'David',
'Samuel',
'Evan',
'Gavin',
'Christian',
'Max',
'Anthony',
'Joseph',
'Julian',
'John',
'Colton',
'Levi',
'Muhammad',
'Isaiah',
'Aaron',
'Tyler',
'Charlie',
'Adam',
'Parker',
'Austin',
'Thomas',
'Zachary',
'Nolan',
'Alex',
'Ian',
'Jonathan',
'Christopher',
'Cooper',
'Hudson',
'Miles',
'Adrian',
'Leo',
'Blake',
'Lincoln',
'Jordan',
'Tristan',
'Jason',
'Josiah',
'Xavier',
'Camden',
'Chase',
'Declan',
'Carson',
'Colin',
'Brody',
'Asher',
'Jeremiah',
'Micah',
'Easton',
'Xander',
'Ryder',
'Nathaniel',
'Elliot',
'Sean',
'Cole'];
var lastnames = [
'Smith',
'Johnson',
'Williams',
'Brown',
'Jones',
'Miller',
'Davis',
'Garcia',
'Rodriguez',
'Wilson',
'Martinez',
'Anderson',
'Taylor',
'Thomas',
'Hernandez',
'Moore',
'Martin',
'Jackson',
'Thompson',
'White',
'Lopez',
'Lee',
'Gonzalez',
'Harris',
'Clark',
'Lewis',
'Robinson',
'Walker',
'Perez',
'Hall',
'Young',
'Allen',
'Sanchez',
'Wright',
'King',
'Scott',
'Green',
'Baker',
'Adams',
'Nelson',
'Hill',
'Ramirez',
'Campbell',
'Mitchell',
'Roberts',
'Carter',
'Phillips',
'Evans',
'Turner',
'Torres',
'Parker',
'Collins',
'Edwards',
'Stewart',
'Flores',
'Morris',
'Nguyen',
'Murphy',
'Rivera',
'Cook',
'Rogers',
'Morgan',
'Peterson',
'Cooper',
'Reed',
'Bailey',
'Bell',
'Gomez',
'Kelly',
'Howard',
'Ward',
'Cox',
'Diaz',
'Richardson',
'Wood',
'Watson',
'Brooks',
'Bennett',
'Gray',
'James',
'Reyes',
'Cruz',
'Hughes',
'Price',
'Myers',
'Long',
'Foster',
'Sanders',
'Ross',
'Morales',
'Powell',
'Sullivan',
'Russell',
'Ortiz',
'Jenkins',
'Gutierrez',
'Perry',
'Butler',
'Barnes',
'Fisher'];
var randomName = function() {
	return [firstnames, lastnames].map((arr)=>arr[Math.floor(Math.random()*arr.length)]);
};