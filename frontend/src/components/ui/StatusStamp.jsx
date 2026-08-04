const STYLES = {
  APPLIED: 'stamp-applied',
  SHORTLISTED: 'stamp-shortlisted',
  INTERVIEW: 'stamp-interview',
  SELECTED: 'stamp-selected',
  REJECTED: 'stamp-rejected',
}

const LABELS = {
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
}

export default function StatusStamp({ status }) {
  return <span className={`stamp ${STYLES[status] || 'stamp-applied'}`}>{LABELS[status] || status}</span>
}
