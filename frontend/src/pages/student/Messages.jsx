import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ChatInbox from '../../components/ui/ChatInbox'
import { getMyProfile } from '../../api/students'

export default function StudentMessages() {
  const [fallbackContact, setFallbackContact] = useState(null)

  useEffect(() => {
    getMyProfile().then((profile) => {
      if (profile.assignedTpoId) {
        setFallbackContact({ userId: profile.assignedTpoId, fullName: profile.assignedTpoName, role: 'TPO', unreadCount: 0 })
      }
    })
  }, [])

  return (
    <DashboardLayout title="Professor Desk" subtitle="Direct 1:1 chat with your assigned TPO professor.">
      <ChatInbox fallbackContact={fallbackContact} />
    </DashboardLayout>
  )
}
