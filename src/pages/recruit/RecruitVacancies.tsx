import { useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, Loader2, MapPin, Search } from "lucide-react";
import { useVacancies } from "@/hooks/useVacancies";

const countryCodes: Record<string, string> = {
  austria: "AT",
  belgium: "BE",
  bulgaria: "BG",
  croatia: "HR",
  cyprus: "CY",
  czechia: "CZ",
  "czech republic": "CZ",
  denmark: "DK",
  estonia: "EE",
  finland: "FI",
  france: "FR",
  germany: "DE",
  greece: "GR",
  hungary: "HU",
  ireland: "IE",
  italy: "IT",
  latvia: "LV",
  lithuania: "LT",
  luxembourg: "LU",
  malta: "MT",
  netherlands: "NL",
  norway: "NO",
  poland: "PL",
  portugal: "PT",
  romania: "RO",
  serbia: "RS",
  slovakia: "SK",
  slovenia: "SI",
  spain: "ES",
  sweden: "SE",
  switzerland: "CH",
  turkey: "TR",
  ukraine: "UA",
  "united kingdom": "GB",
  uk: "GB",
};

function CountryFlag({ country, className = "" }: { country: string; className?: string }) {
  const code = countryCodes[country.trim().toLowerCase()];
  if (!code) {
    return <span className={`inline-flex h-6 min-w-8 items-center justify-center border border-border bg-muted px-1 text-[10px] font-bold ${className}`} aria-label={`${country} flag unavailable`}>--</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
      alt={`${country} flag`}
      width={40}
      height={30}
      loading="lazy"
      className={`h-6 w-8 shrink-0 border border-black/10 object-cover shadow-sm ${className}`}
    />
  );
}

export default function RecruitVacancies() {
  const { data: vacancies = [], isLoading } = useVacancies();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All countries");
  const [jobType, setJobType] = useState("All job types");

  const countries = useMemo(
    () => Array.from(new Set(vacancies.map((vacancy) => vacancy.country))).sort((a, b) => a.localeCompare(b)),
    [vacancies]
  );
  const jobTypes = useMemo(
    () => Array.from(new Set(vacancies.map((vacancy) => vacancy.job_type))).sort((a, b) => a.localeCompare(b)),
    [vacancies]
  );
  const openCount = vacancies.filter((vacancy) => vacancy.status === "Open").length;

  const results = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return vacancies.filter((vacancy) => {
      const matchesSearch =
        !searchTerm ||
        vacancy.title.toLowerCase().includes(searchTerm) ||
        vacancy.city.toLowerCase().includes(searchTerm) ||
        vacancy.country.toLowerCase().includes(searchTerm) ||
        vacancy.job_type.toLowerCase().includes(searchTerm);
      return (
        matchesSearch &&
        (country === "All countries" || vacancy.country === country) &&
        (jobType === "All job types" || vacancy.job_type === jobType)
      );
    });
  }, [country, jobType, query, vacancies]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-10 sm:pb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ro-red">Your next chapter</p>
        <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">
              Find your opportunity in Europe.
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Explore current openings by destination and job type. Choose a role to start a conversation with our team.
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium text-muted-foreground">
            <span className="font-display text-3xl font-semibold text-foreground">{openCount}</span>
            <span className="ml-2">{openCount === 1 ? "open role" : "open roles"}</span>
          </p>
        </div>
      </header>

      <section className="py-9 sm:py-11" aria-labelledby="destinations-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Explore destinations</p>
            <h2 id="destinations-heading" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              Where would you like to work?
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">Select a country to see its vacancies.</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            aria-pressed={country === "All countries"}
            onClick={() => setCountry("All countries")}
            className={`flex min-h-24 items-center justify-between border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              country === "All countries" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
            }`}
          >
            <span>
              <span className="block text-xs uppercase tracking-wide opacity-75">All destinations</span>
              <span className="mt-1 block font-semibold">Every country</span>
            </span>
            <span className="font-display text-2xl font-semibold">{vacancies.length}</span>
          </button>
          {countries.map((item) => {
            const count = vacancies.filter((vacancy) => vacancy.country === item).length;
            const selected = country === item;
            return (
              <button
                type="button"
                key={item}
                aria-pressed={selected}
                onClick={() => setCountry(selected ? "All countries" : item)}
                className={`flex min-h-24 items-center justify-between border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-3">
                  <CountryFlag country={item} />
                  <span className="font-semibold">{item}</span>
                </span>
                <span className="text-sm opacity-75">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border py-9 sm:py-11" aria-labelledby="vacancies-heading">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Browse vacancies</p>
            <h2 id="vacancies-heading" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              Roles to move you forward
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search roles, locations or job types"
                maxLength={80}
                aria-label="Search vacancies"
                className="w-full border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter by job type">
              {["All job types", ...jobTypes].map((type) => (
                <button
                  type="button"
                  key={type}
                  aria-pressed={jobType === type}
                  onClick={() => setJobType(type)}
                  className={`border px-4 py-2 text-sm transition-colors ${
                    jobType === type ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading vacancies…
          </div>
        ) : (
          <>
            <p className="mt-7 text-sm text-muted-foreground" aria-live="polite">
              {results.length} {results.length === 1 ? "vacancy" : "vacancies"} found
            </p>
            {results.length ? (
              <div className="mt-4 divide-y divide-border border-y border-border">
                {results.map((vacancy) => {
                  const isOpen = vacancy.status === "Open";
                  return (
                    <article key={vacancy.id} className="grid gap-5 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:py-7">
                      <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <CountryFlag country={vacancy.country} />
                          <h3 className="font-display text-xl font-semibold sm:text-2xl">{vacancy.title}</h3>
                          <span className={`border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                            isOpen ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground"
                          }`}>
                            {vacancy.status}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{vacancy.city}, {vacancy.country}</span>
                          <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4" />{vacancy.job_type}</span>
                          <span className="font-medium text-foreground">{vacancy.salary}</span>
                        </div>
                        {vacancy.description && (
                          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{vacancy.description}</p>
                        )}
                      </div>
                      {isOpen ? (
                        <a href="#book" className="inline-flex items-center justify-center gap-2 border border-foreground px-5 py-3 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background">
                          Ask about this role <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">More openings soon</span>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 border border-dashed border-border px-6 py-14 text-center">
                <p className="font-display text-xl font-semibold">No vacancies found</p>
                <p className="mt-2 text-sm text-muted-foreground">Try a different search or choose another country or job type.</p>
                <button
                  type="button"
                  onClick={() => { setQuery(""); setCountry("All countries"); setJobType("All job types"); }}
                  className="mt-4 text-sm font-semibold underline underline-offset-4"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
