const STREAMABLE_VIDEO_ID = "3gch73";

export default function VideoShowcase() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Veja o TrioCharge em ação
        </h2>
        <p className="mt-4 text-lg text-neutral-600 max-w-xl mx-auto">
          Carregando iPhone, Apple Watch e AirPods ao mesmo tempo, sem
          bagunça de cabo na mesa.
        </p>

        <div className="mt-10 mx-auto w-full max-w-[380px]">
          <div className="relative w-full overflow-hidden rounded-3xl shadow-lg aspect-[4/5] bg-black">
            <iframe
              src={`https://streamable.com/e/${STREAMABLE_VIDEO_ID}?autoplay=0`}
              title="TrioCharge — Carregador Wireless 3 em 1 em ação"
              className="absolute inset-0 h-full w-full"
              allow="fullscreen; autoplay"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
