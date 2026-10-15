import { useEffect, type ReactNode } from 'react';
import { useAnswers, useTheme } from './lib/storage';
import { href, useRoute } from './lib/router';
import { data, formatDate, party, question } from './lib/data';
import { QuizPage } from './pages/QuizPage';
import { ResultsPage } from './pages/ResultsPage';
import { PartyPage } from './pages/PartyPage';
import { AllQuestionsPage, QuestionPage } from './pages/QuestionPage';
import { HomePage, MethodPage, OverviewPage, SourcesPage, WhyPage } from './pages/InfoPages';

export default function App() {
  const route = useRoute();
  const store = useAnswers();
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'Valgomat 2027',
      quiz: `Spørsmål ${route.name === 'quiz' ? Math.min(route.index + 1, data.questions.length) : ''} av ${data.questions.length} – Valgomat 2027`,
      overview: 'Alle spørsmål – Valgomat 2027',
      results: route.name === 'results' && route.party ? `${party(route.party)?.name ?? 'Fant ikke partiet'} – resultat – Valgomat 2027` : 'Resultat – Valgomat 2027',
      question: `${(route.name === 'question' && question(route.id)?.short) || 'Fant ikke saken'} – Valgomat 2027`,
      method: 'Hvordan beregnes resultatet? – Valgomat 2027',
      why: 'Hvorfor ulikt resultat? – Valgomat 2027',
      sources: 'Kilder – Valgomat 2027',
    };
    document.title = titles[route.name];
    if (route.name !== 'quiz') window.scrollTo({ top: 0 });
  }, [route]);

  let page: ReactNode;
  switch (route.name) {
    case 'home':
      page = <HomePage answers={store.answers} onReset={store.reset} />;
      break;
    case 'quiz':
      page = (
        <QuizPage
          index={route.index}
          answers={store.answers}
          setAnswer={store.setAnswer}
          setImportance={store.setImportance}
          clearAnswer={store.clearAnswer}
          setIndex={store.setIndex}
        />
      );
      break;
    case 'overview':
      page = <OverviewPage answers={store.answers} onReset={store.reset} />;
      break;
    case 'results':
      page = route.party ? (
        <PartyPage partyId={route.party} answers={store.answers} />
      ) : route.tab === 'sporsmal' ? (
        <AllQuestionsPage answers={store.answers} />
      ) : (
        <ResultsPage answers={store.answers} />
      );
      break;
    case 'question':
      page = <QuestionPage id={route.id} answers={store.answers} />;
      break;
    case 'method':
      page = <MethodPage />;
      break;
    case 'why':
      page = <WhyPage />;
      break;
    case 'sources':
      page = <SourcesPage />;
      break;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-3 focus:shadow-lg">
        Hopp til innhold
      </a>
      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4">
        <div className="glass mx-auto flex max-w-5xl items-center gap-1 rounded-full py-1 pl-2 pr-1">
          <a href={href({ name: 'home' })} className="mr-auto flex items-center gap-2 py-1 font-extrabold text-ink no-underline dark:text-slate-100">
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-b from-brand-600 to-brand-800 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]">
              ✓
            </span>
            <span>
              Valgomat <span className="text-brand-600 dark:text-brand-400">2027</span>
            </span>
          </a>
          <nav aria-label="Hovedmeny" className="flex items-center gap-1 text-sm">
            <a className="btn-ghost hidden px-3 text-sm sm:inline-flex" href={href({ name: 'overview' })}>
              Spørsmål
            </a>
            <a className="btn-ghost px-3 text-sm" href={href({ name: 'results' })}>
              Resultat
            </a>
            <a className="btn-ghost hidden px-3 text-sm sm:inline-flex" href={href({ name: 'method' })}>
              Metode
            </a>
            <button type="button" onClick={toggle} className="btn-ghost w-11 px-0" aria-label={dark ? 'Bytt til lys modus' : 'Bytt til mørk modus'} title={dark ? 'Lys modus' : 'Mørk modus'}>
              <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
            </button>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-10">
        {page}
      </main>

      <footer className="px-3 pb-4 text-sm sm:px-4">
        <div className="glass mx-auto flex max-w-5xl flex-col gap-3 rounded-3xl px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="muted">
            Sist oppdatert {formatDate(data.meta.lastUpdated)} · Basert på partiprogrammer for 2025–2029 · Svarene dine lagres kun i din nettleser.
          </p>
          <nav aria-label="Om valgomaten" className="flex flex-wrap gap-x-4 gap-y-1">
            <a href={href({ name: 'method' })}>Metode</a>
            <a href={href({ name: 'why' })}>Hvorfor ulike resultater?</a>
            <a href={href({ name: 'sources' })}>Kilder</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
