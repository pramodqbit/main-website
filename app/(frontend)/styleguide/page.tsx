import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  AnnotatedMedia, BeforeAfterTable, Breadcrumbs, Button, CapabilityTable, CaseCard, Checkbox, CTABox, DecisionRecord,
  EngagementCard, FAQList, FactsPanel, FeatureCase, FileInput, FormField, Heading, Honeypot, IndustryTile, Input,
  JobRow, Lede, LessonGrid, LogLabel, LogPanel, LogStream, Logo, Metric, MonoLabel, Pagination, Pill, PostRow, PrevNext,
  Prose, ProofStrip, Quote, Section, SectionHead, Select, ServiceRow, Steps, TeamCard, Textarea, TextLink, TechByCategory,
  ThemeToggle, Ticker, TileGrid, TypicalProjectRow, type MetricProps,
} from "@/components/ds";
import { ManifestoBlock } from "@/components/blocks/ManifestoBlock";
import { LazyBitField } from "@/components/motion/LazyBitField";
import { TokenSwatches } from "./TokenSwatches";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const batra: MetricProps[] = [
  { value: "99", unit: "%", label: "Prescription extraction accuracy", source: "Batra Hospital · Healthcare" },
  { value: "3–5", unit: "s", label: "Per prescription", source: "Batra Hospital · Healthcare" },
  { value: "80", unit: "%", label: "Less manual data entry", source: "Batra Hospital · Healthcare" },
  { value: "253K+", label: "Medicine knowledge base", source: "Batra Hospital · Healthcare" },
];

const proof: MetricProps[] = [
  batra[0],
  batra[2],
  { value: "60", unit: "%", label: "Fewer manual admin tasks", source: "RestaurantOS · Hospitality" },
  { value: "98", unit: "%", label: "Customer satisfaction", source: "HYTP · Travel" },
];

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 border-t border-line pt-8">
      <MonoLabel tone="brand" as="h2">
        {title}
      </MonoLabel>
      {children}
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div>
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="mt-12 flex flex-col gap-4">
          <LogLabel items={["Design system", "The Engineering Log"]} />
          <Heading size="h1">Styleguide</Heading>
          <Lede>Every building block of the site, rendered with real content. Toggle the theme to check both palettes.</Lede>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-16">
          <Block title="Tokens">
            <TokenSwatches />
          </Block>

          <Block title="Type scale">
            <div className="flex flex-col gap-4">
              <Heading as="h2" size="display" emphasis="And we show our working." breakEmphasis>
                We build the software.
              </Heading>
              <Heading as="h2" size="h1" emphasis="one screen.">Four tools became</Heading>
              <Heading as="h2" size="h2">Selected work, with the receipts</Heading>
              <Heading as="h3" size="h3">Discover</Heading>
              <Heading as="h4" size="h4">Clinical workflows &amp; AI</Heading>
              <p className="text-lg">Body large: product teams in the US and Europe use Qbitlog.</p>
              <p>Body: every decision documented and every result measured.</p>
              <p className="text-sm text-muted">Small muted: secondary information.</p>
              <MonoLabel>Mono label · 2025-10-01</MonoLabel>
            </div>
          </Block>

          <Block title="LogLabel">
            <LogLabel items={["Case study", "Healthcare", "10 weeks"]} />
            <Breadcrumbs items={[{ href: "/work", label: "Work" }, { label: "Batra Hospital" }]} />
          </Block>

          <Block title="Buttons and links">
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/contact" arrow>Book a scoping call</Button>
              <Button href="/work" variant="ghost">How we work</Button>
              <Button variant="primary" size="sm" arrow>Small primary</Button>
              <Button variant="ghost" size="sm">Small ghost</Button>
              <TextLink href="/insights" arrow>Text link</TextLink>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill tone="ok">Auto</Pill>
              <Pill tone="signal">Review</Pill>
              <Pill tone="brand">Live</Pill>
              <Pill tone="muted">Prototype</Pill>
            </div>
          </Block>

          <Block title="Metric + ProofStrip">
            <div className="grid gap-8 sm:grid-cols-3">
              <Metric {...batra[0]} size="lg" />
              <Metric {...batra[1]} size="md" accent />
              <Metric {...batra[3]} size="sm" />
            </div>
            <ProofStrip items={proof} />
          </Block>

          <Block title="DecisionRecord">
            <div className="max-w-[720px]">
              <DecisionRecord
                problem="Pharmacists read every handwritten prescription by hand before dispensing."
                options={[
                  { label: "Fixed OCR templates per prescription pad" },
                  { label: "AI handwriting recognition + medical NLP", chosen: true },
                  { label: "Manual data entry by a larger team" },
                ]}
                decision="AI handwriting recognition with medical NLP, validated against a medicine knowledge base."
                why="No two doctors write alike, so templates break. Validation keeps accuracy high where it matters."
              />
            </div>
          </Block>

          <Block title="LogPanel">
            <div className="max-w-[640px]">
              <LogPanel
                animate
                title="batra-hospital / rx-automation"
                status={{ label: "Shipped", tone: "ok" }}
                rows={[
                  { marker: "Wk 01", phase: "Discover", text: "Pharmacists read every handwritten prescription by hand before dispensing." },
                  { marker: "Wk 02", phase: "Decide", text: "AI handwriting recognition + medical NLP, not fixed templates." },
                  { marker: "Wk 06", phase: "Build", text: <>Every extraction validated against a <b>253K+</b> medicine knowledge base.</> },
                  { marker: "Wk 10", phase: "Measure", measured: true, text: <><b>99%</b> accuracy · <b>3–5s</b> per prescription · <b>80%</b> less manual entry</> },
                ]}
                footer={{ left: "10 weeks · 6 engineers", link: { href: "/work/medical-prescription-ocr", label: "Read the full log" } }}
              />
            </div>
          </Block>

          <Block title="LogStream">
            <div className="max-w-[480px]">
              <LogStream
                meta="Recent"
                entries={[
                  { date: "2025-10-01", type: "Wrote", text: "AI Trends 2025: Multi-Agent Systems, RAG, and GenAI in Production", href: "/insights/ai-trends-2025" },
                  { date: "2024-12-26", type: "Measured", text: "Batra Hospital: 99% prescription extraction accuracy" },
                  { date: "2024-12-26", type: "Shipped", text: "Batra Hospital: prescription processing in 3–5 seconds" },
                ]}
                note="Entries are added by the marketing team in Payload."
              />
            </div>
          </Block>
        </div>
      </Section>

      <Block title="Ticker">
        <Ticker
          items={[
            { type: "SHIPPED", subject: "RestaurantOS", text: "one platform for ordering, inventory and reporting" },
            { type: "MEASURED", subject: "Batra Hospital", text: "99% extraction accuracy", highlight: "99%" },
            { type: "MEASURED", subject: "RestaurantOS", text: "60% fewer manual admin tasks", highlight: "60%" },
            { type: "SHIPPED", subject: "Batra Hospital", text: "Rx processing in 3–5s", highlight: "3–5s" },
          ]}
        />
      </Block>

      <Section>
        <div className="flex flex-col gap-16">
          <Block title="AnnotatedMedia (showcase, tilt)">
            <AnnotatedMedia
              variant="showcase"
              tilt
              chromeLabel="restaurantos / operations-dashboard"
              image={{
                src: "/images/case-studies/re-os/dashboard.png",
                width: 1536,
                height: 1024,
                alt: "RestaurantOS operations dashboard showing sales, orders by channel, today's operations, inventory alerts and top-selling items",
              }}
              annotations={[
                { x: 20, y: 64, title: "Low-stock items surface next to their thresholds.", note: "Kitchens reorder before service, not during it." },
                { x: 57, y: 42, title: "Dine-in, takeaway, delivery and online in one chart.", note: "No more reconciling four reports on Monday." },
                { x: 83, y: 51, title: "Delayed orders are counted live.", note: "Managers act while guests are still at the table." },
              ]}
            />
          </Block>

          <Block title="FeatureCase">
            <FeatureCase
              href="/work/medical-prescription-ocr"
              labels={["Healthcare", "AI automation", "10 weeks"]}
              title="Giving pharmacists their time back at Batra Hospital"
              summary="Handwritten prescriptions now become structured, validated records in seconds."
              metrics={[
                { value: "99%", label: "Extraction accuracy", source: "Batra Hospital, 2024" },
                { value: "3–5s", label: "Per prescription", source: "Batra Hospital, 2024" },
                { value: "80%", label: "Less manual entry", source: "Batra Hospital, 2024" },
              ]}
              visual={
                <Image
                  src="/images/case-studies/hospital/dash.png"
                  width={1896}
                  height={964}
                  alt="Batra Hospital prescription dashboard"
                  sizes="(min-width: 900px) 50vw, 100vw"
                  className="h-auto w-full max-w-[440px] border border-line"
                />
              }
            />
          </Block>

          <Block title="CaseCard ×2">
            <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
              <CaseCard
                href="/work/restaurant-os"
                industry="Hospitality"
                meta="14 wks · 5 eng"
                client="RestaurantOS"
                title="One platform for ordering, inventory and reporting"
                summary="Staff stopped switching between systems; owners got real-time visibility into every location."
                image={{ src: "/images/case-studies/re-os/ordering.png", alt: "RestaurantOS order tracking screen" }}
                metrics={[
                  { value: "60%", label: "Fewer manual admin tasks", source: "RestaurantOS, 2025" },
                  { value: "24/7", label: "Business monitoring", source: "RestaurantOS, 2025" },
                ]}
              />
              <CaseCard
                href="/work/hire-your-travel-partner"
                industry="Travel & senior care"
                meta="16 wks · 5 eng"
                client="Hire Your Travel Partner"
                title="Helping a senior travel business scale with confidence"
                summary="Bookings, trip planning and family updates moved onto one platform travelers and families trust."
                image={{ src: "/images/case-studies/hytp/booking.png", alt: "Hire Your Travel Partner booking management screen" }}
                metrics={[
                  { value: "98%", label: "Customer satisfaction", source: "Hire Your Travel Partner, 2025" },
                  { value: "100%", label: "Digital trip management", source: "Hire Your Travel Partner, 2025" },
                ]}
              />
            </div>
          </Block>

          <Block title="SectionHead + ServiceRow ×3">
            <div>
              <SectionHead
                label="LOG / SERVICES"
                title="What we can own for you"
                intro="Described by the outcome you're buying, not the stack we happen to use."
                more={{ href: "/services", label: "All services" }}
              />
              <ServiceRow
                href="/services/ai-machine-learning"
                category="AI & ML"
                title="Automate the work your team does by hand"
                summary="Document processing, RAG assistants and workflow automation, deployed with guardrails and human review."
                highlights={["Evaluation set and accuracy report on your own data", "Production pipeline with confidence scores", "Human-review workflow for low-confidence results"]}
                caseCount={1}
                casesHref="/work?service=ai-machine-learning"
              />
              <ServiceRow href="/services/web-development" category="Web" title="Web platforms that hold up under real traffic" summary="SaaS products, portals and dashboards built on Next.js, fast by default and easy to hand over." />
              <ServiceRow href="/services/mobile-development" category="Mobile" title="Apps your customers keep on their home screen" summary="iOS and Android from one codebase, with offline support and store-ready releases." />
            </div>
          </Block>

          <Block title="EngagementCard ×3">
            <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
              <EngagementCard
                name="Fixed-scope project"
                bestFor="A defined product or feature with a clear finish line."
                duration="6–16 weeks"
                team="3–6 people: engineers, a designer and a delivery lead"
                pricing="Fixed price, agreed after the Decide phase"
                includes={["Discovery and decision log", "Design and build in two-week sprints", "Launch and handover"]}
              />
              <EngagementCard
                name="Dedicated product team"
                bestFor="An evolving product that needs a team every month, not a one-off build."
                duration="3 months minimum, rolling monthly"
                team="2–8 people, scaled with your roadmap"
                pricing="Monthly, time and materials"
                includes={["Your roadmap, our team", "Sprint demos and weekly written updates", "Scale up or down with 30 days' notice"]}
              />
              <EngagementCard
                name="Audit and rescue sprint"
                bestFor="An existing codebase, AI pilot or cloud setup that is slow, fragile or stuck."
                duration="2–4 weeks"
                team="1–2 senior engineers"
                pricing="Fixed price"
                includes={["Written audit of code, infrastructure and costs", "Prioritised fix list", "Optional follow-on build"]}
              />
            </div>
          </Block>

          <Block title="TypicalProjectRow">
            <ul className="m-0 list-none p-0">
              <TypicalProjectRow
                name="Document and handwriting extraction"
                duration="8–12 weeks"
                description="Scans or photos in, structured records out, with validation against a reference database."
              />
              <TypicalProjectRow
                name="Knowledge assistant (RAG) over internal documents"
                duration="6–10 weeks"
                description="Answers questions from your own documents with citations, access control and an evaluation set."
              />
            </ul>
          </Block>

          <Block title="FactsPanel + BeforeAfterTable + LessonGrid">
            <div className="grid grid-cols-[280px_1fr] gap-10 max-[900px]:grid-cols-1">
              <FactsPanel
                rows={[
                  { label: "Client", value: "Batra Hospital" },
                  { label: "Industry", value: "Healthcare" },
                  { label: "Year", value: "2024" },
                  { label: "Duration", value: "10 weeks" },
                  { label: "Platforms", value: "Web app, REST API" },
                  { label: "Status", value: <Pill tone="signal">Prototype</Pill> },
                ]}
              />
              <div className="flex flex-col gap-10">
                <BeforeAfterTable
                  rows={[
                    {
                      aspect: "Reading the prescription",
                      before: "A pharmacist deciphers the handwriting and re-types it.",
                      after: "OCR and medical NLP extract patient, medicine, dose, frequency and duration; the pharmacist reviews and edits.",
                    },
                    {
                      aspect: "Unclear prescriptions",
                      before: "Re-read, guess, or call the doctor.",
                      after: "Flagged automatically by confidence score, with low, high or urgent review priority.",
                    },
                  ]}
                />
                <LessonGrid
                  items={[
                    {
                      title: "The language model is the bottleneck",
                      text: "The Gemini correction step took about 4.5 of the ~8.5 seconds. For production we would cache common corrections.",
                    },
                    {
                      title: "Image quality matters as much as the model",
                      text: "Accuracy drops quickly with blurry or skewed photos. Capture guidance in the upload screen is as important as the OCR engines.",
                    },
                  ]}
                />
              </div>
            </div>
          </Block>

          <Block title="CapabilityTable">
            <CapabilityTable
              caption="Industries and services"
              emptyLabel="Ask us"
              columns={[
                { key: "ai", label: "AI & ML", href: "/services/ai-machine-learning" },
                { key: "web", label: "Web", href: "/services/web-development" },
                { key: "mobile", label: "Mobile", href: "/services/mobile-development" },
              ]}
              rows={[
                {
                  key: "hc",
                  label: "Healthcare",
                  href: "/industries/healthcare",
                  cells: [{ href: "/work/medical-prescription-ocr", label: "Batra Hospital" }, null, null],
                },
                {
                  key: "hosp",
                  label: "Hospitality",
                  href: "/industries/hospitality",
                  cells: [null, { href: "/work/restaurant-os", label: "RestaurantOS" }, null],
                },
              ]}
            />
          </Block>

          <Block title="TechByCategory + PrevNext">
            <TechByCategory
              groups={[
                { category: "Frontend", names: ["React", "TypeScript"] },
                { category: "Backend", names: ["FastAPI", "PostgreSQL"] },
                { category: "AI", names: ["Google Document AI", "AWS Comprehend Medical", "Gemini"] },
              ]}
            />
            <PrevNext
              className="mt-10"
              prev={{ href: "/work/hire-your-travel-partner", client: "Hire Your Travel Partner", title: "Helping a senior travel business scale" }}
              next={{ href: "/work/restaurant-os", client: "RestaurantOS", title: "One platform for ordering and inventory" }}
            />
          </Block>

          <Block title="FeatureCase / CaseCard with Prototype pill">
            <FeatureCase
              href="/work/medical-prescription-ocr"
              labels={["Healthcare", "AI automation", "10 weeks"]}
              title="Reading handwritten prescriptions with AI: a working prototype"
              summary="A prototype that turns photos of handwritten prescriptions into structured, validated medication records."
              prototype
              metrics={[
                { value: "98–99%", label: "Medicine-name extraction in demo testing", source: "Qbitlog prototype testing on synthetic data" },
                { value: "~8.5s", label: "End-to-end processing (demo)", source: "Qbitlog pipeline timings, demo environment" },
              ]}
              visual={
                <Image
                  src="/images/case-studies/hospital/dash.png"
                  width={1896}
                  height={964}
                  alt="Batra Hospital prescription dashboard"
                  sizes="(min-width: 900px) 50vw, 100vw"
                  className="h-auto w-full max-w-[440px] border border-line"
                />
              }
            />
            <div className="mt-5 grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
              <CaseCard
                href="/work/restaurant-os"
                industry="Hospitality"
                meta="14 wks · 5 eng"
                client="RestaurantOS"
                title="One platform for ordering, inventory and reporting"
                summary="A front-end prototype that brings menu, orders, tables and inventory into one dashboard."
                prototype
                image={{ src: "/images/case-studies/re-os/ordering.png", alt: "RestaurantOS order tracking screen" }}
                metrics={[
                  { value: "8", label: "Working screens", source: "RestaurantOS prototype" },
                  { value: "20+", label: "Reusable UI components", source: "RestaurantOS prototype" },
                ]}
              />
            </div>
          </Block>

          <Block title="IndustryTile ×4">
            <TileGrid>
              <IndustryTile href="/industries/healthcare" label="Healthcare" title="Clinical workflows & AI" summary="Prescription automation, patient portals, and privacy-conscious data handling." footLabel="1 case study →" />
              <IndustryTile href="/industries/hospitality" label="Hospitality" title="Restaurant operations" summary="Ordering, inventory, multi-location reporting and staff tooling." footLabel="1 case study →" />
              <IndustryTile href="/industries/travel" label="Travel" title="Booking & trip platforms" summary="Itineraries, bookings, traveler support and family communication." footLabel="1 case study →" />
              <IndustryTile href="/industries/saas" label="SaaS" title="Products from zero to v1" summary="MVPs, multi-tenant platforms and AI features for funded startups." footLabel="Talk to us →" />
            </TileGrid>
          </Block>

          <Block title="PostRow ×3">
            <div>
              <PostRow href="/insights/ai-trends-2025" date="2025-10-01" category="AI" title="AI Trends 2025: Multi-Agent Systems, RAG, and GenAI in Production" />
              <PostRow href="/insights" date="2025-09-15" category="RAG" title="Building Secure RAG Architectures for the Enterprise" />
              <PostRow href="/insights" date="2025-08-30" category="Edge AI" title="Edge AI Inference: Running Small Models Blazingly Fast" />
            </div>
            <Pagination page={2} totalPages={5} basePath="/insights" />
          </Block>

          <Block title="TeamCard + JobRow">
            <div className="grid grid-cols-4 gap-6 max-[960px]:grid-cols-2 max-[520px]:grid-cols-1">
              <TeamCard name="Qbitlog Engineering" role="Engineering team" bio="The team behind our case studies and insights." />
              <TeamCard name="Sample Person" role="Chief Technology Officer" />
            </div>
            <div>
              <JobRow href="/careers" title="Business Development Executive" department="Sales" location="Remote" type="Full-time" />
            </div>
          </Block>
        </div>
      </Section>

      <Section tone="inverted">
        <div className="flex flex-col gap-16">
          <SectionHead
            label="LOG / METHOD"
            title="How a Qbitlog project runs"
            intro="Four phases, each ending in something you can read, not just a status meeting."
          />
          <Steps
            tone="inverted"
            steps={[
              { name: "Discover", description: "We sit with the people doing the work and write down what actually slows them down.", deliverable: "Problem brief · success metrics" },
              { name: "Decide", description: "We weigh the options on paper, including the ones we reject, before writing code.", deliverable: "Decision log · architecture · estimate" },
              { name: "Build", description: "Two-week sprints, a demo every sprint, and a written update every week.", deliverable: "Working software · weekly log" },
              { name: "Measure", description: "We check the metrics we agreed in Phase 1 and publish the results.", deliverable: "Results report · roadmap" },
            ]}
          />
          <Quote
            label="Client note"
            quote="The biggest improvement wasn't just accuracy. It was how much time our pharmacists got back."
            name="Dr. Rajesh Mehta"
            role="Pharmacy Lead"
            company="Batra Hospital"
          />
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-16">
          <Block title="FAQList">
            <div className="grid grid-cols-[200px_1fr] gap-8 max-[860px]:grid-cols-1 max-[860px]:gap-0">
              <MonoLabel tone="brand" className="pt-[26px]">LOG / FAQ</MonoLabel>
              <FAQList
                defaultOpen={0}
                items={[
                  { question: "How long does a typical project take?", answer: "Our recent projects ran 10–16 weeks from discovery to launch." },
                  { question: "Can you take over an existing codebase?", answer: "Yes. We start with an audit and hand you a written log of what we found." },
                ]}
              />
            </div>
          </Block>

          <Block title="CTABox">
            <CTABox
              label="Next entry"
              title="Let's write the first page of"
              emphasis="your log."
              body="A 30-minute scoping call with an engineer, not a salesperson."
              button={{ href: "/contact", label: "Book a scoping call" }}
              details={[
                { label: "Call", value: "30 minutes, video" },
                { label: "You get", value: "Written summary + rough estimate" },
                { label: "Email", value: "hello@qbitlog.com" },
              ]}
            />
          </Block>

          <Block title="Form fields">
            <form className="relative grid max-w-[720px] gap-6 sm:grid-cols-2" action="#">
              <FormField label="Name" htmlFor="sg-name" required>
                <Input id="sg-name" name="name" autoComplete="name" />
              </FormField>
              <FormField label="Email" htmlFor="sg-email" required error="Enter a valid email address.">
                <Input id="sg-email" name="email" type="email" aria-invalid="true" aria-describedby="sg-email-error" defaultValue="not-an-email" />
              </FormField>
              <FormField label="Budget" htmlFor="sg-budget" hint="A rough range is fine.">
                <Select
                  id="sg-budget"
                  name="budget"
                  aria-describedby="sg-budget-hint"
                  placeholder="Select a range"
                  options={[
                    { value: "<25k", label: "Under $25k" },
                    { value: "25-50k", label: "$25k–50k" },
                  ]}
                />
              </FormField>
              <FormField label="Résumé" htmlFor="sg-file">
                <FileInput id="sg-file" name="resume" accept=".pdf,.doc,.docx" />
              </FormField>
              <FormField label="Message" htmlFor="sg-message" className="sm:col-span-2">
                <Textarea id="sg-message" name="message" />
              </FormField>
              <div className="sm:col-span-2">
                <Checkbox id="sg-consent" name="consent" label="I agree to Qbitlog storing my details to reply to this enquiry." />
              </div>
              <Honeypot />
              <div>
                <Button type="submit" arrow>Send</Button>
              </div>
            </form>
          </Block>

          <Block title="Prose">
            <Prose>
              <h2>Rich text heading</h2>
              <p>Articles, legal pages and case-study bodies use this container. <a href="#">Links are violet</a>, and <code>code</code> is mono.</p>
              <ul><li>Bullet one</li><li>Bullet two</li></ul>
              <blockquote>A quote inside prose.</blockquote>
            </Prose>
          </Block>

          <Block title="BitField (field)">
            <div data-bitfield-host="" className="relative h-[320px] overflow-hidden border border-line">
              <div aria-hidden="true" className="absolute inset-0 dotgrid bits-mask [[data-bitfield-host]:has(canvas)_&]:hidden" />
              <LazyBitField variant="field" />
            </div>
          </Block>

          <Block title="Manifesto (story layer)">
            <div className="border border-line">
              <ManifestoBlock
                block={{
                  blockType: "manifesto",
                  label: "ENTRY 001 / WHY WE EXIST",
                  lines: [
                    { text: "In 2025, a few engineers got tired of building for everyone else." },
                    { text: "Now we build yours the same way: *like it’s ours*, with every decision on the record." },
                  ],
                  signature: "The Qbitlog team · 2025",
                }}
              />
            </div>
          </Block>

          <Block title="BitField (wordmark)">
            <div className="relative border-t border-line">
              <LazyBitField variant="wordmark" />
              <span className="absolute bottom-2 left-0 font-mono text-[11px] uppercase tracking-[.08em] text-muted">
                Every bit, on the record
              </span>
            </div>
          </Block>
        </div>
      </Section>
    </div>
  );
}
