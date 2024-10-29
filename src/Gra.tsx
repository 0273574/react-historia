'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Book, HelpCircle, Trophy, Volume2, VolumeX } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Opcja {
  zmianaSil: number;
  zmianaMorale: number;
  info?: string;
}

interface Wydarzenie {
  nazwa: string;
  opis: string;
  opcje: Record<string, Opcja>;
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
      }
];

interface AlertProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ title, children, icon }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex items-center mb-2">
        {icon}
        <p className="font-bold ml-2">{title}</p>
      </div>
      <p>{children}</p>
    </CardContent>
  </Card>
);

const achievements = [
  { id: 'survivor', name: 'Przetrwałeś', description: 'Ukończyłeś grę' },
  { id: 'highMorale', name: 'Wysoki duch bojowy', description: 'Osiągnąłeś morale powyżej 8' },
  { id: 'strongForces', name: 'Potęga militarna', description: 'Osiągnąłeś siły powyżej 15' },
  { id: 'perfectVictory', name: 'Doskonałe zwycięstwo', description: 'Ukończyłeś grę z siłami > 15 i morale > 7' },
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

  const playSound = useCallback((soundName: string) => {
    if (soundEnabled) {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.play();
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (mode === 'game' && tura <= 10 && punkty > 0 && morale > 0) {
      setWydarzenie(wydarzenia[Math.floor(Math.random() * wydarzenia.length)]);
      setStatystyki(prev => [...prev, { tura, punkty, morale }]);
    } else if (mode === 'game') {
      zakonczGre();
    }
  }, [tura, mode, punkty, morale]);

  const wykonajAkcje = (zmianaSil: number, zmianaMorale: number, info: string = "") => {
    const difficultyMultiplier = difficulty === 'easy' ? 1.2 : difficulty === 'hard' ? 0.8 : 1;
    const adjustedZmianaSil = Math.round(zmianaSil * difficultyMultiplier);
    const adjustedZmianaMorale = Math.round(zmianaMorale * difficultyMultiplier);

    setPunkty((prev) => Math.max(0, prev + adjustedZmianaSil));
    setMorale((prev) => Math.max(0, prev + adjustedZmianaMorale));
    setTura((prev) => prev + 1);
    setKomunikat(`Zmiana sił: ${adjustedZmianaSil}, Zmiana morale: ${adjustedZmianaMorale}`);
    setHistorycznaInformacja(info);
    setScore((prev) => prev + Math.abs(adjustedZmianaSil) + Math.abs(adjustedZmianaMorale));

    playSound('action');
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
    setMode('game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-500 to-yellow-500 p-8">
      <div className="max-w-4xl mx-auto bg-white/90 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-5xl font-bold mb-8 text-center text-red-800">Front Wschodni 1941</h1>

        {mode === 'start' && (
          <div className="text-center space-y-4">
            <Select onValueChange={(value: 'easy' | 'normal' | 'hard') => setDifficulty(value)}>
              <SelectTrigger className="w-[180px] mx-auto">
                <SelectValue placeholder="Wybierz trudność" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Łatwy</SelectItem>
                <SelectItem value="normal">Normalny</SelectItem>
                <SelectItem value="hard">Trudny</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setMode('game')} className="w-full">
              Zagraj w grę
            </Button>
            <Button onClick={() => setMode('info')} variant="outline" className="w-full">
              Informacje historyczne
            </Button>
          </div>
        )}

        {mode === 'info' && (
          <div>
            {wydarzenia.map((event, index) => (
              <Card key={index} className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-800">{event.nazwa}</h2>
                  <p className="mb-6 text-gray-700">{event.opis}</p>
                  <ul>
                    {Object.entries(event.opcje).map(([opcja, { zmianaSil, zmianaMorale, info }]) => (
                      <li key={opcja} className="text-gray-600 mb-2">
                        <strong>{opcja}:</strong> Zmiana sił: {zmianaSil}, Zmiana morale: {zmianaMorale}
                        {info && <p className="text-gray-500 text-sm">Info: {info}</p>}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
            <Button onClick={() => setMode('start')} className="mt-8 block mx-auto">
              Powrót
            </Button>
          </div>
        )}

        {mode === 'game' && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold text-blue-800">Tura</p>
                  <p className="text-4xl font-bold text-blue-600">{tura}/10</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold text-green-800">Siły</p>
                  <p className="text-4xl font-bold text-green-600">{punkty}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold text-yellow-800">Morale</p>
                  <p className="text-4xl font-bold text-yellow-600">{morale}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-semibold text-purple-800">Wynik</p>
                  <p className="text-4xl font-bold text-purple-600">{score}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={statystyki}>
                    <XAxis dataKey="tura" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="punkty" stroke="#48bb78" name="Siły" />
                    <Line type="monotone" dataKey="morale" stroke="#ecc94b" name="Morale" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {wydarzenie && !koniecGry && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-3xl font-bold mb-4 text-red-800">{wydarzenie.nazwa}</h2>
                  <p className="mb-6 text-gray-700">{wydarzenie.opis}</p>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(wydarzenie.opcje).map(([opcja, { zmianaSil, zmianaMorale, info }]) => (
                      <Button
                        key={opcja}
                        onClick={() => wykonajAkcje(zmianaSil, zmianaMorale, info)}
                        className="w-full"
                      >
                        {opcja}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {koniecGry && (
              <>
                <Alert title="Koniec gry" icon={<AlertCircle className="text-yellow-600 w-6 h-6" />}>
                  <p>{komunikat}</p>
                  <p className="mt-2">Twój końcowy wynik: {score}</p>
                </Alert>
                <Button onClick={resetGame} className="w-full mt-4">
                  Zagraj ponownie
                </Button>
              </>
            )}

            <div className="mt-8 flex justify-between items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Trophy className="mr-2 h-4 w-4" />
                    Osiągnięcia
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Osiągnięcia</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
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
                </DialogContent>
              
              </Dialog>

              <Button
                variant="outline"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Pomoc
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Jak grać?</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>1. Wybierz poziom trudności przed rozpoczęciem gry.</p>
                    <p>2. W każdej turze podejmuj decyzje, które wpłyną na twoje siły i morale.</p>
                    <p>3. Gra trwa 10 tur lub do momentu, gdy twoje siły lub morale spadną do zera.</p>
                    <p>4. Zdobywaj punkty i odblokowuj osiągnięcia!</p>
                    <p>5. Staraj się utrzymać jak najwyższe siły i morale, aby odnieść zwycięstwo.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GraFrontWschodni;
