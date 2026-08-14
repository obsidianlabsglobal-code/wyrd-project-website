import { brand } from "@/data/brand";
import { useReveal } from "@/hooks/use-environment";

export function Studio() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="studio" ref={ref} className="reveal relative py-[var(--section-space)]">
      <div className="container-wyrd">
        <div className="grid gap-12 md:grid-cols-12">
          <p className="micro md:col-span-3">The studio</p>
          <div className="md:col-span-8 md:col-start-4">
            <p className="display-lg max-w-[18ch]">
              Technology should disappear into the experience.
            </p>
            <p className="lede mt-10">
              WYRD Designs is a design and technology studio in {brand.location}. The work is made
              by people who care about how a thing is decided, not only how it looks when it ships.
              What you are reading now is the studio's own material — no borrowed claims, no
              invented history.
            </p>
            <dl className="mt-14 grid gap-8 sm:grid-cols-3">
              <div className="rule-line pt-5">
                <dt className="micro">Studio</dt>
                <dd className="mt-2 text-lg">{brand.name}</dd>
              </div>
              <div className="rule-line pt-5">
                <dt className="micro">Based in</dt>
                <dd className="mt-2 text-lg">{brand.location}</dd>
              </div>
              <div className="rule-line pt-5">
                <dt className="micro">Discipline</dt>
                <dd className="mt-2 text-lg">Design &amp; technology</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
