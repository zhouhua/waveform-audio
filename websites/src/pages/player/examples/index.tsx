import { useTranslation } from 'react-i18next';

export default function PlayerExamples() {
  const { t } = useTranslation();

  return (
    <div className="container py-16">
      <div className="max-w-3xl">
        <div className="space-y-6">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            {t('player.examples.title')}
          </h1>
          <p className="leading-7 text-muted-foreground">
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
