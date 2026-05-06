import { Play, BookOpen, Leaf, TrendingUp, Globe2 } from "lucide-react";

const lessons = [
  { title: "Budgeting in 5 minutes", tag: "Finance 101", duration: "5 min read", icon: TrendingUp, color: "var(--brand-cyan)", sdg: 8 },
  { title: "What is responsible consumption?", tag: "SDG 12", duration: "Watch · 3:42", icon: Leaf, color: "var(--brand-emerald)", sdg: 12, video: true },
  { title: "Inequality, explained", tag: "SDG 10", duration: "Infographic", icon: Globe2, color: "var(--brand-violet)", sdg: 10 },
  { title: "Compound interest magic", tag: "Finance", duration: "4 min read", icon: BookOpen, color: "var(--brand-cyan)", sdg: 4 },
  { title: "Micro-loans changing lives", tag: "Impact", duration: "Watch · 5:10", icon: Play, color: "var(--brand-emerald)", sdg: 1, video: true },
  { title: "Ethical shopping checklist", tag: "SDG 12", duration: "2 min read", icon: Leaf, color: "var(--brand-violet)", sdg: 12 },
];

export function LearnSection() {
  return (
    <section className="glass rounded-2xl p-5 hover-lift">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Literacy & Education</div>
          <h2 className="text-xl font-bold mt-1">Bite-sized learning</h2>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:block">← swipe to explore →</span>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2 snap-x snap-mandatory">
        {lessons.map((l, i) => (
          <article key={i}
            className="snap-start shrink-0 w-64 sm:w-72 glass-strong rounded-2xl p-4 hover-lift cursor-pointer relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition"
                 style={{ background: l.color }} />
            <div className="relative">
              <div className="aspect-video rounded-xl mb-3 flex items-center justify-center border border-white/5"
                   style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${l.color} 30%, transparent), transparent)` }}>
                <div className="h-12 w-12 rounded-full flex items-center justify-center"
                     style={{ background: l.color }}>
                  {l.video ? (
                    <Play className="h-5 w-5 text-background fill-current ml-0.5" />
                  ) : (
                    <l.icon className="h-5 w-5 text-background" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10"
                      style={{ color: l.color }}>
                  {l.tag}
                </span>
                <span className="text-[10px] text-muted-foreground">SDG {l.sdg}</span>
              </div>
              <h3 className="font-semibold text-sm leading-snug">{l.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-2">{l.duration}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
