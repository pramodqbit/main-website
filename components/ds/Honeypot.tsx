/** Spam trap: a field humans never see or fill. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label htmlFor="company_website">Company website</label>
      <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export default Honeypot;
