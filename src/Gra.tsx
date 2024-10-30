'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Opcja {
  zmianaSil: number;
  zmianaMorale: number;
  info?: string;
}

interface Wydarzenie {
  nazwa: string;
  opis: string;
  opcje: Record<string, Opcja>;
  opisStrona: string;
}

const wydarzenia: Wydarzenie[] = [
  {
    nazwa: "Kocioł pod Smoleńskiem",
    opis: "Niemieckie wojska, nacierające w kierunku Moskwy w ramach operacji Barbarossa, otoczyły siły radzieckie w rejonie Smoleńska. Mimo twardego oporu, Armia Czerwona została okrążona, co doprowadziło do ogromnych strat po stronie ZSRR.",
    opcje: {
      "Przebić się": { zmianaSil: -1, zmianaMorale: 2 },
      "Bronić pozycji": { zmianaSil: -2, zmianaMorale: 1 },
      "Poddać się": { zmianaSil: -3, zmianaMorale: 0 },
      "Zrzuty zaopatrzenia": { zmianaSil: -1, zmianaMorale: 3, info: "Zrzuty zaopatrzenia pozwalają na dłuższą obronę i podtrzymanie morale okrążonych wojsk." },
      "Ataki bombowe na linie niemieckie": { zmianaSil: -2, zmianaMorale: 4, info: "Ataki bombowe osłabiają niemieckie okrążenie, dając szansę na przebicie się." }
    },
    opisStrona: "Kocioł pod Smoleńskiem (lipiec–wrzesień 1941) Siły niemieckie: Grupa Armii „Środek" pod dowództwem Fiodora von Bocka, składająca się z 9. i 4. Armii, 3. i 2. Grupy Pancernej. Pojazdy i czołgi: PzKpfw III i IV (główne czołgi średnie), czołgi lekkie PzKpfw II. Artyleria: Samobieżna artyleria, działa 88 mm Flak, które używane były też w roli przeciwpancernej. Siły radzieckie: Front Zachodni, Centralny i Rezerwowy, w tym 16., 19. i 20. Armia. Pojazdy i czołgi: Czołgi T-34 i KW-1 (cięższy opancerzony model), a także starsze modele, takie jak BT-7, T-26 i T-28. Artyleria: Działa przeciwlotnicze kal. 76 mm, które okazały się skuteczne przeciwko niemieckim czołgom."
  },
  {
    nazwa: "Kocioł pod Kijowem",
    opis: "Jedna z największych i najkrwawszych operacji okrążających na froncie wschodnim. Niemcy zdołali otoczyć i zniszczyć główne siły radzieckie wokół Kijowa.",
    opcje: {
      "Kontratakować": { zmianaSil: -2, zmianaMorale: 3 },
      "Ewakuować": { zmianaSil: -1, zmianaMorale: 1 },
      "Utrzymać Kijów": { zmianaSil: -3, zmianaMorale: 2 },
      "Wsparcie pancerne": { zmianaSil: -2, zmianaMorale: 4, info: "Użycie rezerw pancernych może pomóc w przebiciu się z okrążenia, ale wiąże się z ryzykiem ich utraty." },
      "Zrzuty zaopatrzenia": { zmianaSil: -1, zmianaMorale: 2, info: "Zrzuty zaopatrzenia przedłużają obronę i dają czas na zorganizowanie kontrataku." }
    },
    opisStrona: "Kocioł pod Kijowem (sierpień–wrzesień 1941) Siły niemieckie: Grupa Armii „Południe" (Feldmarszałek Gerd von Rundstedt) oraz jednostki z Grupy Armii „Środek". Pojazdy i czołgi: PzKpfw III i IV, wspierane przez pojazdy zwiadowcze, działa samobieżne, półgąsienicowe transportery opancerzone (Sd.Kfz. 251). Lotnictwo: Luftwaffe z bombowcami i samolotami myśliwskimi (Junkers Ju 87, Messerschmitt Bf 109). Siły radzieckie: Front Południowo-Zachodni, 5., 37., 26. Armia, w tym również jednostki zmotoryzowane i kawaleryjskie. Pojazdy i czołgi: Czołgi T-34 i KW-1, starsze modele (BT-5, BT-7). Artyleria: Wzmożone użycie artylerii przeciwpancernej i piechoty w formacjach mobilnych."
  },
  {
    nazwa: "Oblężenie Leningradu",
    opis: "Leningrad (obecny Petersburg) został otoczony przez wojska niemieckie i fińskie. Mieszkańcy miasta przez prawie 900 dni cierpieli głód, zimno i bombardowania, broniąc się zaciekle.",
    opcje: {
      "Wzmocnić obronę": { zmianaSil: 0, zmianaMorale: 2 },
      "Ewakuować cywilów": { zmianaSil: -1, zmianaMorale: 1 },
      "Przerwać okrążenie": { zmianaSil: -2, zmianaMorale: 3 },
      "Produkcja czołgów w mieście": { zmianaSil: -1, zmianaMorale: 4, info: "Fabryki Leningradu kontynuują produkcję czołgów, wzmacniając obronę miasta." },
      "Zrzuty zaopatrzenia": { zmianaSil: -1, zmianaMorale: 3, info: "Zrzuty zaopatrzenia przez Jezioro Ładoga ('Droga Życia') pomagają przetrwać oblężenie." }
    },
    opisStrona: "Oblężenie Leningradu (wrzesień 1941 – styczeń 1944) Siły niemieckie: Grupa Armii „Północ" pod dowództwem Wilhelma von Leeba. Pojazdy i czołgi: Niemcy wykorzystali głównie PzKpfw IV, działa samobieżne Stug III, Sd.Kfz. 10 i Sd.Kfz. 251 do transportu. Artyleria: Ciężkie działa oblężnicze, np. haubice kal. 210 mm, działa kolejowe typu Schwerer Gustav, ostrzał z morza przez niemiecką Kriegsmarine. Siły radzieckie: Leningradzki Front Obrony oraz późniejsze oddziały Frontu Wołchowskiego. Pojazdy i czołgi: Czołgi T-34 oraz lekkie T-26 i KW-1, których załogi często walczyły także jako piechota. Artyleria: Działa przeciwpancerne oraz moździerze, wsparcie ogniowe z pobliskiej Floty Bałtyckiej."
  }
  // ... (remaining wydarzenia entries follow the same pattern)
];

const achievements = [
  { id: 'survivor', name: 'Przetrwałeś', description: 'Ukończyłeś grę' },
  { id: 'highMorale', name: 'Wysoki duch bojowy', description: 'Osiągnąłeś morale powyżej 8' },
  { id: 'strongForces', name: 'Potęga militarna', description: 'Osiągnąłeś siły powyżej 15' },
  { id: 'perfectVictory', name: 'Doskonałe zwycięstwo', description: 'Ukończyłeś grę z siłami > 15 i morale > 7' },
  { id: 'strategist', name: 'Strateg', description: 'Podejmij 3 decyzje z rzędu tego samego typu' },
  { id: 'luckyGeneral', name: 'Szczęśliwy generał', description: 'Doświadcz 3 pozytywnych losowych wydarzeń' }
];

const GraFrontWschodni: React.FC = () => {
  const [mode, setMode] = useState<'start' | 'game' | 'info'>('start');
  const [punkty, setPunkty] = useState(10);
  const [morale, setMorale] = useState(5);
  const [tura, setTura] = useState(1);
  const [wydarzenie, setWydarzenie] = useState<Wydarzenie | null>(null);
  const [koniecGry, setKoniecGry] = useState(false);
  const [komunikat, setKomunikat] = useState("");
  const [historycznaInformacja, setHistorycznaInformacja] = useState("");
  const [statystyki, setStatystyki] = useState<{ tura: number; punkty: number; morale: number }[]>([
    { tura: 0, punkty: 10, morale: 5 }
  ]);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [score, setScore] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streak, setStreak] = useState(0);
  const [lastDecision, setLastDecision] = useState<string | null>(null);
  const [luckyEvents, setLuckyEvents] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const playSound = useCallback((soundName: string) => {
    if (soundEnabled) {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.play().catch(error => console.error('Error playing sound:', error));
    }
  }, [soundEnabled]);

  const shuffledEvents = useMemo(() => {
    return [...wydarzenia].sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    if (mode === 'game' && tura <= 10 && punkty > 0 && morale > 0) {
      setWydarzenie(shuffledEvents[(tura - 1) % shuffledEvents.length]);
      setStatystyki(prev => [...prev, { tura, punkty, morale }]);
    } else if (mode === 'game') {
      zakonczGre();
    }
  }, [tura, mode, punkty, morale, shuffledEvents]);

  const wykonajAkcje = (zmianaSil: number, zmianaMorale: number, info: string = "", decyzja: string) => {
    const difficultyMultiplier = difficulty === 'easy' ? 1.2 : difficulty === 'hard' ? 0.8 : 1;
    let adjustedZmianaSil = Math.round(zmianaSil * difficultyMultiplier);
    let adjustedZmianaMorale = Math.round(zmianaMorale * difficultyMultiplier);

    if (decyzja === lastDecision) {
      setStreak(prev => prev + 1);
      if (streak >= 2) {
        adjustedZmianaSil += 1;
        adjustedZmianaMorale += 1;
        unlockAchievement('strategist');
      }
    } else {
      setStreak(0);
    }
    setLastDecision(decyzja);

    setPunkty(prev => Math.max(0, prev + adjustedZmianaSil));
    setMorale(prev => Math.max(0, prev + adjustedZmianaMorale));
    setTura(prev => prev + 1);
    setKomunikat(`Zmiana sił: ${adjustedZmianaSil}, Zmiana morale: ${adjustedZmianaMorale}`);
    setHistorycznaInformacja(info);
    setScore(prev => prev + Math.abs(adjustedZmianaSil) + Math.abs(adjustedZmianaMorale));

    playSound('action');

    if (Math.random() < 0.2) {
      triggerRandomEvent();
    }
  };

  const triggerRandomEvent = () => {
    const events = [
      { message: "Nieoczekiwane wsparcie sojuszników!", effect: () => { setPunkty(prev => prev + 2); setMorale(prev => prev + 1); setLuckyEvents(prev => prev + 1); } },
      { message: "Nagły atak partyzantów!", effect: () => { setPunkty(prev => prev - 1); setMorale(prev => prev + 2); } },
      { message: "Problemy z zaopatrzeniem!", effect: () => { setPunkty(prev => prev - 1); setMorale(prev => prev - 1); } },
      { message: "Przełom technologiczny!", effect: () => { setPunkty(prev => prev + 3); setLuckyEvents(prev => prev + 1); } },
      { message: "Dezercja w szeregach!", effect: () => { setPunkty(prev => prev - 2); setMorale(prev => prev - 2); } }
    ];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setKomunikat(prev => `${prev}\n${randomEvent.message}`);
    randomEvent.effect();
    playSound('random_event');

    if (luckyEvents >= 2) {
      unlockAchievement('luckyGeneral');
    }
  };

  const zakonczGre = () => {
    setKoniecGry(true);
    if (punkty <= 0) {
      setKomunikat("Twoje siły zostały rozbite. Niemcy zwyciężyli.");
      playSound('defeat');
    } else if (morale <= 0) {
      setKomunikat("Morale twojej armii upadło. Żołnierze masowo dezerterują.");
      playSound('defeat');
    } else if (punkty > 15 && morale > 7) {
      setKomunikat("Gratulacje! Udało Ci się powstrzymać niemiecką inwazję i odnieść zwycięstwo!");
      playSound('victory');
      unlockAchievement('perfectVictory');
