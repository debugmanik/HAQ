import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-stone-border bg-paper py-8 mt-auto">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-navy uppercase tracking-wider">HAQ — Legal & Civil Help</h4>
            <p className="text-xs text-slate-muted leading-relaxed max-w-sm">
              Empowering Indian citizens to navigate government grievances and claim their civil rights through simplified legal frameworks and RTI drafts.
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-navy uppercase tracking-wider">Important Resources</h4>
            <ul className="text-xs space-y-2 text-slate-muted">
              <li>
                <a 
                  href="https://pgportal.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline hover:text-navy"
                >
                  CPGRAMS Portal (Govt of India)
                </a>
              </li>
              <li>
                <a 
                  href="https://rtionline.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline hover:text-navy"
                >
                  RTI Online Portal
                </a>
              </li>
              <li>
                <a 
                  href="https://www.india.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline hover:text-navy"
                >
                  National Portal of India
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-navy uppercase tracking-wider">Important Legal Notice</h4>
            <p className="text-xs text-slate-muted leading-relaxed">
              <strong>Disclaimer:</strong> HAQ is a civic education tool. It does not provide official legal advice, nor is it affiliated with any government department or ministry. All RTI drafts and action paths are informational templates.
            </p>
          </div>
        </div>
        <div className="border-t border-stone-border/40 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-muted">
          <span>&copy; {new Date().getFullYear()} HAQ Civic Initiative. Designed for Indian Civil Advocacy.</span>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/" className="hover:underline hover:text-navy">Intake</Link>
            <Link href="/help" className="hover:underline hover:text-navy">Guided Help</Link>
            <span>RTI Act, 2005 Sec 6(1)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
