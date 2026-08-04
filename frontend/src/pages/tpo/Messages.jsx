import DashboardLayout from '../../components/layout/DashboardLayout'
import ChatInbox from '../../components/ui/ChatInbox'

export default function TpoMessages() {
  return (
    <DashboardLayout title="Messages" subtitle="Direct conversations with students who've reached out.">
      <ChatInbox />
    </DashboardLayout>
  )
}
