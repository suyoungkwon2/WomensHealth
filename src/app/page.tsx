import { Header } from "@/components";
import { PhysicalPart } from "@/parts/Physical";
import { MentalPart } from "@/parts/Mental";
import { FundingPart } from "@/parts/Funding";

/**
 * One-page story. Each part lives in its own file under src/parts/ so that
 * three people can work in parallel without merge conflicts.
 * Section ids (physical / mental / funding) drive the header nav — don't rename.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="top" style={{ paddingTop: "var(--header-h)" }}>
        <PhysicalPart />
        <MentalPart />
        <FundingPart />
      </main>
    </>
  );
}
