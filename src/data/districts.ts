export interface District {
  id:     number
  name:   string
  num:    string
  color:  string
  accent: string
  emoji:  string
  desc:   string
}

export interface City {
  id:     number
  name:   string
  num:    string
  color:  string
  accent: string
  emoji:  string
  desc:   string
}

export const DISTRICTS: District[] = [
  { id:1,  name:"Ciutat Vella",         num:"01", color:"#8B1A1A", accent:"#FFB347", emoji:"⛪", desc:"El barri medieval i gòtic de Barcelona, bressol de la ciutat." },
  { id:2,  name:"Eixample",             num:"02", color:"#1A3A5C", accent:"#7EB8D4", emoji:"🏛️", desc:"L'eixample modernista de Cerdà, amb la Sagrada Família i el Passeig de Gràcia." },
  { id:3,  name:"Sants-Montjuïc",      num:"03", color:"#1A4A2A", accent:"#7ED4A0", emoji:"⛰️", desc:"El districte del port, Montjuïc i la cultura obrera." },
  { id:4,  name:"Les Corts",            num:"04", color:"#3A1A5C", accent:"#B47ED4", emoji:"🔵", desc:"Camp Nou i la Zona Universitària al cor del districte." },
  { id:5,  name:"Sarrià-Sant Gervasi", num:"05", color:"#1A3A1A", accent:"#A0D47E", emoji:"🌿", desc:"Les zones altes i residencials de Barcelona." },
  { id:6,  name:"Gràcia",              num:"06", color:"#5C3A1A", accent:"#D4A07E", emoji:"🎨", desc:"El barri bohemi, de les festes majors i la Plaça del Sol." },
  { id:7,  name:"Horta-Guinardó",      num:"07", color:"#1A4A4A", accent:"#7ED4D4", emoji:"🌄", desc:"Barri de muntanya entre el Parc del Laberint i el Guinardó." },
  { id:8,  name:"Nou Barris",          num:"08", color:"#4A1A1A", accent:"#D47E7E", emoji:"🏘️", desc:"Districte popular del nord de Barcelona, ple d'història obrera." },
  { id:9,  name:"Sant Andreu",         num:"09", color:"#1A1A4A", accent:"#7E7ED4", emoji:"🔔", desc:"Antic municipi annexionat, conserva la seva identitat de barri." },
  { id:10, name:"Sant Martí",          num:"10", color:"#3A3A1A", accent:"#D4D47E", emoji:"🏖️", desc:"Del Poblenou i el @22 fins a la Barceloneta i el litoral." },
];

export const CITYS: City[] = [
    { id:0,  name:"Barcelona",            num:"00", color:"#8B1A1A", accent:"#FFB347", emoji:"⛪", desc:"La ciutat de Barcelona, bressol de la cultura catalana." },

]