import { useTranslation } from 'react-i18next';

export default function Examples() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl">
      <div className="space-y-6">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          {t('player.docs.examples.title')}
        </h1>
        <p className="leading-7 text-muted-foreground">
          Coming soon...
        </p>
      </div>
    </div>
  );
}
