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
  opisStrona: string;  // Zmieniono z opisstrona na opisStrona dla lepszej spójności
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
        opisStrona: 'Kocioł pod Smoleńskiem (lipiec–wrzesień 1941) - Siły niemieckie: Grupa Armii „Środek" pod dowództwem Fiodora von Bocka, składająca się z 9. i 4. Armii, 3. i 2. Grupy Pancernej. Pojazdy i czołgi: PzKpfw III i IV, czołgi lekkie PzKpfw II. Siły radzieckie: Front Zachodni, Centralny i Rezerwowy, w tym 16., 19. i 20. Armia.'
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
        opisStrona: 'Kocioł pod Kijowem (sierpień–wrzesień 1941) - Siły niemieckie: Grupa Armii „Południe" pod dowództwem Gerda von Rundstedta oraz jednostki z Grupy Armii „Środek". Pojazdy i czołgi: PzKpfw III i IV, wsparcie lotnicze Luftwaffe. Siły radzieckie: Front Południowo-Zachodni, składający się z 5., 37., i 26. Armii.'
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
        opisStrona: 'Oblężenie Leningradu (wrzesień 1941 – styczeń 1944) - Siły niemieckie: Grupa Armii „Północ" pod dowództwem Wilhelma von Leeba. Siły radzieckie: Leningradzki Front Obrony oraz Front Wołchowski. Główne wyposażenie: czołgi T-34, KW-1 i artyleria przeciwpancerna.'
      },
      {
        nazwa: "Bitwa na Łuku Kurskim",
        opis: "Największa bitwa pancerna w historii. Niemcy planują w ramach operacji 'Cytadela' rozbić siły radzieckie, ale czy radzieckie przygotowania i obrona skutecznie zniweczą te plany?",
        opcje: {
          "Przygotować obronę": { zmianaSil: 0, zmianaMorale: 3 },
          "Zaatakować pierwsi": { zmianaSil: -2, zmianaMorale: 4 },
          "Wycofać się": { zmianaSil: -1, zmianaMorale: 1 },
          "Skierowanie lotnictwa na niemieckie kolumny pancerne": { zmianaSil: -2, zmianaMorale: 5, info: "Ataki lotnicze na niemieckie czołgi znacząco osłabiają siłę uderzeniową wroga." },
          "Koncentracja czołgów w kluczowym miejscu": { zmianaSil: -1, zmianaMorale: 4, info: "Skoncentrowanie sił pancernych pozwala na skuteczne odparcie niemieckiego natarcia." }
        },
        opisStrona: 'Bitwa na Łuku Kurskim (lipiec–sierpień 1943) - Siły niemieckie: Grupa Armii „Południe" i „Środek", wyposażone w czołgi Tygrys I, Pantera i działa Elefant. Siły radzieckie: Front Centralny, Woroneżski i Stepowy pod dowództwem Żukowa, wykorzystujące czołgi T-34/76 i działa samobieżne SU-152.'
      },
      {
        nazwa: "Oblężenie Stalingradu",
        opis: "Stalingrad był areną jednej z najkrwawszych i najważniejszych bitew II wojny światowej. Niemcy, chcąc zdobyć miasto nad Wołgą, napotkali na zaciekły opór Armii Czerwonej.",
        opcje: {
          "Bronić miasta za wszelką cenę": { zmianaSil: -2, zmianaMorale: 4 },
          "Kontratak": { zmianaSil: -3, zmianaMorale: 5 },
          "Wycofać się za Wołgę": { zmianaSil: -1, zmianaMorale: 0 },
          "Przerzut czołgów z rezerw": { zmianaSil: -2, zmianaMorale: 6, info: "Wzmocnienie obrony Stalingradu czołgami z rezerw znacząco zwiększa szanse na utrzymanie miasta." },
          "Ataki bombowe na linie niemieckie": { zmianaSil: -1, zmianaMorale: 3, info: "Bombardowania osłabiają niemieckie natarcie i utrudniają dostawy zaopatrzenia dla wroga." }
        },
        opisStrona: 'Oblężenie Stalingradu (sierpień 1942 – luty 1943) - Siły niemieckie: 6. Armia pod dowództwem Paulusa, wspierana przez 4. Armię Pancerną. Siły radzieckie: Front Stalingradzki, Front Doński i Południowo-Zachodni, w tym słynna 62. Armia Czujkowa.'
      },
      {
        nazwa: "Walki o Dyneburg",
        opis: "Dyneburg w Łotwie był jednym z kluczowych punktów obrony radzieckiej na Dźwinie w czasie niemieckiej inwazji na ZSRR. Jeśli Niemcy szybko przełamią obronę, zdobywając miasto otworzy im to drogę na dalsze terytoria ZSRR.",
        opcje: {
          "Wzmocnić garnizon": { zmianaSil: -1, zmianaMorale: 2 },
          "Wysadzić mosty": { zmianaSil: 0, zmianaMorale: 1 },
          "Ewakuować miasto": { zmianaSil: -2, zmianaMorale: 0 },
          "Kontruderzenie": { zmianaSil: -2, zmianaMorale: 3, info: "Szybkie kontruderzenie może zaskoczyć niemieckie siły i opóźnić ich postęp." },
          "Mobilizacja cywilów": { zmianaSil: -1, zmianaMorale: 2, info: "Zaangażowanie cywilów w obronę miasta zwiększa szanse na jego utrzymanie, ale może prowadzić do większych strat." }
        },
        opisStrona: 'Walki o Dyneburg (lipiec 1941) - Siły niemieckie: Grupa Armii „Północ" pod dowództwem von Leeba, głównie jednostki 4. Grupy Pancernej. Siły radzieckie: 8. i 11. Armia Frontu Północno-Zachodniego, wyposażone w starsze modele czołgów T-26 i BT-7.'
      },
      {
        nazwa: "Obrona Dźwiny",
        opis: "Rzeka Dźwina stanowi ważną linię obrony dla sił radzieckich podczas niemieckiej inwazji. Obrona tej naturalnej bariery ma opóźnić postępy wroga i umożliwić mobilizację większych sił Armii Czerwonej.",
        opcje: {
          "Zaminować przeprawy": { zmianaSil: 0, zmianaMorale: 2 },
          "Kontratak": { zmianaSil: -2, zmianaMorale: 3 },
          "Wycofać się na drugą linię obrony": { zmianaSil: -1, zmianaMorale: 1 },
          "Wzmocnienie artylerii": { zmianaSil: -1, zmianaMorale: 3, info: "Skoncentrowanie artylerii wzdłuż rzeki może skutecznie powstrzymać niemieckie próby przeprawy." },
          "Taktyka spalonej ziemi": { zmianaSil: -2, zmianaMorale: 2, info: "Zniszczenie infrastruktury i zasobów spowolni niemiecki postęp, ale odbije się na ludności cywilnej." }
        },
        opisStrona: 'Obrona Dźwiny (czerwiec 1941) - Siły niemieckie: Grupa Armii „Północ" z wsparciem Luftwaffe. Siły radzieckie: Front Północno-Zachodni z artylerią przeciwpancerną i zaporami minowymi.'
      }
];

const achievements = [
  { id: 'survivor', name: 'Przetrwałeś', description: 'Ukończyłeś grę' },
  { id: 'highMorale', name: 'Wysoki duch bojowy', description: 'Osiągnąłeś morale powyżej 8' },
  { id: 'strongForces', name: 'Potęga militarna', description: 'Osiągnąłeś siły powyżej 15' },
  { id: 'perfectVictory', name: 'Doskonałe zwycięstwo', description: 'Ukończyłeś grę z siłami > 15 i morale > 7' },
  { id: 'strategist', name: 'Strateg', description: 'Podejmij 3 decyzje z rzędu tego samego typu' },
  { id: 'luckyGeneral', name: 'Szczęśliwy generał', description: 'Doświadcz 3 pozytywnych losowych wydarzeń' },
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
      audio.play();
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

    setPunkty((prev) => Math.max(0, prev + adjustedZmianaSil));
    setMorale((prev) => Math.max(0, prev + adjustedZmianaMorale));
    setTura((prev) => prev + 1);
    setKomunikat(`Zmiana sił: ${adjustedZmianaSil}, Zmiana morale: ${adjustedZmianaMorale}`);
    setHistorycznaInformacja(info);
    setScore((prev) => prev + Math.abs(adjustedZmianaSil) + Math.abs(adjustedZmianaMorale));

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
    } else if (punkty > 10 || morale > 5) {
      setKomunikat("Udało Ci się przetrwać inwazję, ale straty są ogromne.");
      playSound('partialVictory');
    } else {
      setKomunikat("Przetrwałeś, ale sytuacja jest krytyczna. Przyszłość ZSRR stoi pod znakiem zapytania.");
      playSound('partialVictory');
    }
    unlockAchievement('survivor');
    if (morale > 8) unlockAchievement('highMorale');
    if (punkty > 15) unlockAchievement('strongForces');
  };

  const unlockAchievement = (achievementId: string) => {
    if (!unlockedAchievements.includes(achievementId)) {
      setUnlockedAchievements(prev => [...prev, achievementId]);
      playSound('achievement');
    }
  };

  const resetGame = () => {
    setPunkty(10);
    setMorale(5);
    setTura(1);
    setKoniecGry(false);
    setKomunikat("");
    setHistorycznaInformacja("");
    setStatystyki([{ tura: 0, punkty: 10, morale: 5 }]);
    setScore(0);
    setStreak(0);
    setLastDecision(null);
    setLuckyEvents(0);
    setMode('game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-500 to-yellow-500 p-8">
      <div className="max-w-4xl mx-auto bg-white/90 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-5xl font-bold mb-8 text-center text-red-800">Front Wschodni 1941</h1>

        {mode === 'start' && (
          <div className="text-center space-y-4">
            <select
              className="w-[180px] mx-auto p-2 border rounded"
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'normal' | 'hard')}
              value={difficulty}
            >
              <option value="easy">Łatwy</option>
              <option value="normal">Normalny</option>
              <option value="hard">Trudny</option>
            </select>
            <button
              onClick={() => setMode('game')}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Zagraj w grę
            </button>
            <button
              onClick={() => setMode('info')}
              className="w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
            >
              Informacje historyczne
            </button>
          </div>
        )}

        {mode === 'info' && (
          <div>
            {wydarzenia.map((event, index) => (
              <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">{event.nazwa}</h2>
                <p className="mb-6 text-gray-700">{event.opisStrona}</p>
              </div>
            ))}
            <button
              onClick={() => setMode('start')}
              className="mt-8 block mx-auto bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Powrót
            </button>
          </div>
        )}

        {mode === 'game' && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <p className="text-lg font-semibold text-blue-800">Tura</p>
                <p className="text-4xl font-bold text-blue-600">{tura}/10</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <p className="text-lg font-semibold text-green-800">Siły</p>
                <p className="text-4xl font-bold text-green-600">{punkty}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <p className="text-lg font-semibold text-yellow-800">Morale</p>
                <p className="text-4xl font-bold text-yellow-600">{morale}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <p className="text-lg font-semibold text-purple-800">Wynik</p>
                <p className="text-4xl font-bold text-purple-600">{score}</p>
              </div>
            </div>

            <div className="mb-8 p-4 bg-white rounded-lg shadow">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={statystyki}>
                  <XAxis dataKey="tura" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="punkty" stroke="#48bb78" name="Siły" />
                  <Line type="monotone" dataKey="morale" stroke="#ecc94b" name="Morale" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {wydarzenie && !koniecGry && (
              <div className="mb-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-3xl font-bold mb-4 text-red-800">{wydarzenie.nazwa}</h2>
                <p className="mb-6 text-gray-700">{wydarzenie.opis}</p>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(wydarzenie.opcje).map(([opcja, { zmianaSil, zmianaMorale, info }]) => (
                    <button
                      key={opcja}
                      onClick={() => wykonajAkcje(zmianaSil, zmianaMorale, info, opcja)}
                      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      {opcja}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {koniecGry && (
              <>
                <div className="mb-4 p-4  bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                  <p className="font-bold">Koniec gry</p>
                  <p>{komunikat}</p>
                  <p className="mt-2">Twój końcowy wynik: {score}</p>
                </div>
                <button
                  onClick={resetGame}
                  className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Zagraj ponownie
                </button>
              </>
            )}

            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => setShowAchievements(true)}
                className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
              >
                Osiągnięcia
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
              >
                {soundEnabled ? 'Wycisz' : 'Włącz dźwięk'}
              </button>

              <button
                onClick={() => setShowHelp(true)}
                className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
              >
                Pomoc
              </button>
            </div>

            {showAchievements && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-4">Osiągnięcia</h2>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg ${
                          unlockedAchievements.includes(achievement.id)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <h3 className="font-bold">{achievement.name}</h3>
                        <p>{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAchievements(false)}
                    className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Zamknij
                  </button>
                </div>
              </div>
            )}

            {showHelp && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-4">Jak grać?</h2>
                  <div className="space-y-4">
                    <p>1. Wybierz poziom trudności przed rozpoczęciem gry.</p>
                    <p>2. W każdej turze podejmuj decyzje, które wpłyną na twoje siły i morale.</p>
                    <p>3. Gra trwa 10 tur lub do momentu, gdy twoje siły lub morale spadną do zera.</p>
                    <p>4. Zdobywaj punkty i odblokowuj osiągnięcia!</p>
                    <p>5. Staraj się utrzymać jak najwyższe siły i morale, aby odnieść zwycięstwo.</p>
                    <p>6. Uważaj na losowe wydarzenia, które mogą zmienić bieg gry!</p>
                    <p>7. Konsekwentne decyzje mogą przynieść dodatkowe bonusy.</p>
                  </div>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Zamknij
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GraFrontWschodni;
