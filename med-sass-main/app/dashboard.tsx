"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  Calendar,
  Users,
  Clock,
  Plus,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react"

interface Appointment {
  id: number
  patient: string
  time: string
  type: string
  status: "confirmed" | "pending" | "completed"
  dayOfMonth: number
  month: number
  year: number
}

interface DayAppointmentDetails {
  patient: string
  time: string
  type: string
  status: "confirmed" | "pending" | "completed"
}

interface PatientProfile {
  id: string
  name: string
  phone: string
  email: string
}

interface Notification {
  id: string
  type: "patient_registered" | "appointment_created" | "general"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export default function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false)
  const [showPatientForm, setShowPatientForm] = useState(false)
  const [showPatientSearch, setShowPatientSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [registeredPatients, setRegisteredPatients] = useState<PatientProfile[]>([])
  const [newPatientName, setNewPatientName] = useState("")
  const [newPatientPhone, setNewPatientPhone] = useState("")
  const [newPatientEmail, setNewPatientEmail] = useState("")

  const [selectedDayAppointments, setSelectedDayAppointments] = useState<DayAppointmentDetails[]>([])
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null)
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<number | null>(null)
  const [selectedCalendarYear, setSelectedCalendarYear] = useState<number | null>(null)

  const [appointments, setAppointments] = useState<Appointment[]>([])

  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [newAppointmentPatientName, setNewAppointmentPatientName] = useState("")
  const [newTime, setNewTime] = useState("")
  const [newType, setNewType] = useState("")
  const [newAppointmentDay, setNewAppointmentDay] = useState<number | null>(null)

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const [calendarModalMonth, setCalendarModalMonth] = useState(new Date().getMonth())
  const [calendarModalYear, setCalendarModalYear] = useState(new Date().getFullYear())

  const [showAppointmentSuccess, setShowAppointmentSuccess] = useState(false)

  const addNotification = (type: Notification["type"], title: string, message: string) => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  const handleNewAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAppointmentPatientName && newTime && newType && newAppointmentDay !== null) {
      const newAppointment: Appointment = {
        id: appointments.length + 1,
        patient: newAppointmentPatientName,
        time: newTime,
        type: newType,
        status: "pending",
        dayOfMonth: newAppointmentDay,
        month: currentMonth,
        year: currentYear,
      }
      setAppointments(
        [...appointments, newAppointment].sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year
          if (a.month !== b.month) return a.month - b.month
          if (a.dayOfMonth !== b.dayOfMonth) return a.dayOfMonth - b.dayOfMonth
          return a.time.localeCompare(b.time)
        }),
      )
      setNewAppointmentPatientName("")
      setNewTime("")
      setNewType("")
      setNewAppointmentDay(null)
      setShowNewAppointment(false)
      setShowAppointmentSuccess(true)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "pending":
        return "Pendente"
      case "completed":
        return "Concluído"
      default:
        return status
    }
  }

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPatientName && newPatientPhone && newPatientEmail) {
      const newPatientProfile: PatientProfile = {
        id: `patient-${Date.now()}`,
        name: newPatientName,
        phone: newPatientPhone,
        email: newPatientEmail,
      }

      setRegisteredPatients([...registeredPatients, newPatientProfile])

      const newNotification: Notification = {
        id: `notification-${Date.now()}`,
        type: "patient_registered",
        title: "Novo Paciente Cadastrado",
        message: `${newPatientName} foi cadastrado com sucesso no sistema.`,
        timestamp: new Date(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])

      setNewPatientName("")
      setNewPatientPhone("")
      setNewPatientEmail("")
      setShowPatientForm(false)
    }
  }

  const handleDayClick = (day: number, month: number, year: number) => {
    setSelectedCalendarDay(day)
    setSelectedCalendarMonth(month)
    setSelectedCalendarYear(year)

    const dayAppointmentsFromSystem = appointments
      .filter((appt) => appt.dayOfMonth === day && appt.month === month && appt.year === year)
      .map((appt) => ({
        patient: appt.patient,
        time: appt.time,
        type: appt.type,
        status: appt.status,
      }))
      .sort((a, b) => a.time.localeCompare(b.time))

    setSelectedDayAppointments(dayAppointmentsFromSystem)
  }

  const handleOpenCalendarModal = () => {
    setSelectedDayAppointments([])
    setSelectedCalendarDay(null)
    setSelectedCalendarMonth(null)
    setSelectedCalendarYear(null)
    setCalendarModalMonth(new Date().getMonth())
    setCalendarModalYear(new Date().getFullYear())
    setShowCalendar(true)
  }

  const handleSelectAppointmentDay = (day: number) => {
    setNewAppointmentDay(day)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const navigateCalendarModalMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (calendarModalMonth === 0) {
        setCalendarModalMonth(11)
        setCalendarModalYear(calendarModalYear - 1)
      } else {
        setCalendarModalMonth(calendarModalMonth - 1)
      }
    } else {
      if (calendarModalMonth === 11) {
        setCalendarModalMonth(0)
        setCalendarModalYear(calendarModalYear + 1)
      } else {
        setCalendarModalMonth(calendarModalMonth + 1)
      }
    }
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const today = new Date().getDate()
  const currentRealMonth = new Date().getMonth()
  const currentRealYear = new Date().getFullYear()

  const todaysAppointments = appointments
    .filter((appt) => appt.dayOfMonth === today && appt.month === currentRealMonth && appt.year === currentRealYear)
    .sort((a, b) => a.time.localeCompare(b.time))

  const filteredRegisteredPatients = registeredPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatNotificationTime = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Agora"
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)}d atrás`
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const now = new Date()
  const currentDateTime = now.getTime()

  const upcomingAppointments = appointments
    .filter((appt) => {
      const [apptHour, apptMinute] = appt.time.split(":").map(Number)
      const apptDate = new Date(appt.year, appt.month, appt.dayOfMonth, apptHour, apptMinute)
      return apptDate.getTime() > currentDateTime
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      if (a.month !== b.month) return a.month - b.month
      if (a.dayOfMonth !== b.dayOfMonth) return a.dayOfMonth - b.dayOfMonth
      return a.time.localeCompare(b.time)
    })

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="w-full px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-sm sm:text-base font-semibold text-blue-900 truncate">MedSaaS</h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Notifications Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 relative p-1.5 sm:p-2"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                      {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-blue-100 z-50 max-w-[calc(100vw-1rem)] transform -translate-x-2 sm:translate-x-0">
                    <div className="p-3 sm:p-4 border-b border-blue-100">
                      <h3 className="text-base sm:text-lg font-semibold text-blue-900">Notificações</h3>
                    </div>
                    <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 sm:p-4 border-b border-blue-50 hover:bg-blue-50 transition-colors ${
                              !notification.read ? "bg-blue-25" : ""
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-1">
                                  <h4 className="text-sm font-medium text-blue-900 leading-tight">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                                  )}
                                </div>
                                <p className="text-sm text-blue-600 leading-relaxed break-words">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-blue-400 mt-2">
                                  {formatNotificationTime(notification.timestamp)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="p-1 h-6 w-6 text-blue-400 hover:text-blue-600 flex-shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 sm:p-8 text-center text-blue-600">
                          <Bell className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Nenhuma notificação</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button variant="ghost" size="sm" className="text-blue-600 p-1.5 sm:p-2">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-600 p-1.5 sm:p-2">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay para fechar notificações quando clicar fora */}
      {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />}

      <div className="w-full px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 lg:mr-6">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-600 truncate">Hoje</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{todaysAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 lg:mr-6">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-green-600 truncate">Pacientes</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{registeredPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-yellow-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 lg:mr-6">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-yellow-600 truncate">Pendentes</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                    {appointments.filter((a) => a.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-purple-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 lg:mr-6">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-purple-600 truncate">Total</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            <Card className="border-blue-200">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-blue-900 text-base sm:text-lg lg:text-xl">
                      Agendamentos de Hoje (Dia {today})
                    </CardTitle>
                    <CardDescription className="text-blue-600 text-sm">Gerencie suas consultas do dia</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowNewAppointment(true)}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Novo Agendamento</span>
                    <span className="sm:hidden">Novo</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {todaysAppointments.length > 0 ? (
                    todaysAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-blue-900 truncate text-sm sm:text-base">
                              {appointment.patient}
                            </p>
                            <p className="text-xs sm:text-sm text-blue-600 truncate">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 flex-shrink-0">
                          <span className="text-xs sm:text-sm font-medium text-blue-700">{appointment.time}</span>
                          <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-blue-600 text-center py-6 sm:py-8 text-sm">Nenhum agendamento para hoje.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-blue-200">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-blue-900 text-base sm:text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                <Button
                  onClick={handleOpenCalendarModal}
                  variant="outline"
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent text-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Agenda Completa
                </Button>
                <Button
                  onClick={() => setShowPatientForm(true)}
                  variant="outline"
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 text-sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Cadastrar Paciente
                </Button>
                <Button
                  onClick={() => setShowPatientSearch(true)}
                  variant="outline"
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 text-sm"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Paciente
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-blue-900 text-base sm:text-lg">Próximas Consultas</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-48 overflow-y-auto pr-1 sm:pr-2">
                    {upcomingAppointments.map((appt, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 sm:space-x-3 p-2 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-blue-900 truncate text-xs sm:text-sm">{appt.patient}</p>
                          <p className="text-xs text-blue-600 truncate">
                            {appt.dayOfMonth} de {monthNames[appt.month]} - {appt.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-600 text-sm">Nenhuma consulta futura agendada.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-lg max-h-[95vh] flex flex-col">
            <CardHeader className="flex-shrink-0 p-4 sm:p-6">
              <CardTitle className="text-blue-900 text-lg">Novo Agendamento</CardTitle>
              <CardDescription className="text-blue-600 text-sm">Adicione uma nova consulta à agenda</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
              <form onSubmit={handleNewAppointment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newAppointmentPatientName" className="text-blue-900 text-sm">
                    Paciente
                  </Label>
                  <Input
                    id="newAppointmentPatientName"
                    placeholder="Nome do paciente"
                    value={newAppointmentPatientName}
                    onChange={(e) => setNewAppointmentPatientName(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 text-sm"
                    required
                  />
                </div>

                {/* Calendário para seleção de data */}
                <div className="space-y-2">
                  <Label className="text-blue-900 text-sm">Data do Agendamento</Label>
                  <div className="border border-blue-200 rounded-lg p-3 sm:p-4">
                    {/* Header do calendário */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth("prev")}
                        className="p-1 h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <h3 className="text-sm font-medium text-blue-900">
                        {monthNames[currentMonth]} {currentYear}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth("next")}
                        className="p-1 h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>

                    {/* Dias da semana */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-blue-600 p-1 sm:p-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Dias do mês */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Espaços vazios para o início do mês */}
                      {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }, (_, i) => (
                        <div key={`empty-${i}`} className="p-1 sm:p-2"></div>
                      ))}

                      {/* Dias do mês */}
                      {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => {
                        const day = i + 1
                        const isSelected = newAppointmentDay === day
                        const hasAppointment = appointments.some(
                          (appt) => appt.dayOfMonth === day && appt.month === currentMonth && appt.year === currentYear,
                        )

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleSelectAppointmentDay(day)}
                            className={`p-1 sm:p-2 text-xs sm:text-sm rounded hover:bg-blue-100 transition-colors relative
                              ${isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : "text-blue-900"}
                              ${hasAppointment && !isSelected ? "bg-blue-50" : ""}
                            `}
                          >
                            {day}
                            {hasAppointment && !isSelected && (
                              <span className="absolute top-0.5 right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></span>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {newAppointmentDay && (
                      <div className="mt-3 text-xs sm:text-sm text-blue-600">
                        Data selecionada: {newAppointmentDay} de {monthNames[currentMonth]} de {currentYear}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-blue-900 text-sm">
                      Horário
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="border-blue-200 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-blue-900 text-sm">
                      Tipo
                    </Label>
                    <Input
                      id="type"
                      placeholder="Consulta, Retorno, Exame..."
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="border-blue-200 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm">
                    Agendar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewAppointment(false)
                      setNewAppointmentDay(null)
                    }}
                    className="flex-1 border-blue-200 text-blue-700 text-sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Appointment Success Pop-up */}
      {showAppointmentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm text-center">
            <CardContent className="p-6 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mb-4" />
              <CardTitle className="text-blue-900 mb-2 text-lg">Agendamento Realizado!</CardTitle>
              <CardDescription className="text-blue-600 mb-4 text-sm">
                Seu agendamento foi criado com sucesso. Um e-mail de confirmação será enviado ao paciente em breve.
              </CardDescription>
              <Button
                onClick={() => setShowAppointmentSuccess(false)}
                className="bg-blue-600 hover:bg-blue-700 text-sm"
              >
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[95vh] flex flex-col">
            <CardHeader className="flex-shrink-0 p-4 sm:p-6">
              <CardTitle className="text-blue-900 text-lg">Agenda Completa</CardTitle>
              <CardDescription className="text-blue-600 text-sm">
                Visualize todos os agendamentos. Clique em um dia para ver os pacientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4">
                {/* Header do calendário do modal */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateCalendarModalMonth("prev")}
                    className="p-1 h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="text-sm font-medium text-blue-900">
                    {monthNames[calendarModalMonth]} {calendarModalYear}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateCalendarModalMonth("next")}
                    className="p-1 h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm font-medium text-blue-600">
                  <div>Dom</div>
                  <div>Seg</div>
                  <div>Ter</div>
                  <div>Qua</div>
                  <div>Qui</div>
                  <div>Sex</div>
                  <div>Sáb</div>
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {/* Espaços vazios para o início do mês */}
                  {Array.from({ length: getFirstDayOfMonth(calendarModalMonth, calendarModalYear) }, (_, i) => (
                    <div key={`empty-cal-${i}`} className="p-2"></div>
                  ))}

                  {/* Dias do mês */}
                  {Array.from({ length: getDaysInMonth(calendarModalMonth, calendarModalYear) }, (_, i) => {
                    const day = i + 1
                    const isSelected =
                      selectedCalendarDay === day &&
                      selectedCalendarMonth === calendarModalMonth &&
                      selectedCalendarYear === calendarModalYear
                    const hasAppointments = appointments.some(
                      (appt) =>
                        appt.dayOfMonth === day && appt.month === calendarModalMonth && appt.year === calendarModalYear,
                    )

                    return (
                      <div
                        key={day}
                        onClick={() => handleDayClick(day, calendarModalMonth, calendarModalYear)}
                        className={`h-10 sm:h-12 border border-blue-100 rounded flex items-center justify-center text-xs sm:text-sm cursor-pointer hover:bg-blue-100 transition-colors relative
                                        ${isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                                      `}
                      >
                        {day}
                        {hasAppointments && !isSelected && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
                        )}
                        {hasAppointments && isSelected && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {selectedCalendarDay !== null && selectedCalendarMonth !== null && selectedCalendarYear !== null ? (
                <div className="mt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">
                    Agendamentos para o dia {selectedCalendarDay} de {monthNames[selectedCalendarMonth]} de{" "}
                    {selectedCalendarYear}
                  </h3>
                  <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                    {selectedDayAppointments.length > 0 ? (
                      selectedDayAppointments.map((appt, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-blue-900 font-medium truncate block text-sm">{appt.patient}</span>
                              <p className="text-xs text-blue-500 truncate">{appt.type}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <Badge variant="outline" className={`${getStatusColor(appt.status)} border-none text-xs`}>
                              {getStatusText(appt.status)}
                            </Badge>
                            <p className="text-xs sm:text-sm text-blue-700 mt-1">{appt.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="mt-6 text-center text-blue-600 text-sm">
                        Nenhum agendamento para o dia {selectedCalendarDay} de {monthNames[selectedCalendarMonth]} de{" "}
                        {selectedCalendarYear}.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-center text-blue-600 text-sm">
                  Clique em um dia no calendário para ver os agendamentos.
                </div>
              )}

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowCalendar(false)}
                  variant="outline"
                  className="border-blue-200 text-blue-700 text-sm"
                >
                  Fechar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patient Registration Modal */}
      {showPatientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-md max-h-[95vh] flex flex-col">
            <CardHeader className="flex-shrink-0 p-4 sm:p-6">
              <CardTitle className="text-blue-900 text-lg">Cadastrar Paciente</CardTitle>
              <CardDescription className="text-blue-600 text-sm">Adicione um novo paciente ao sistema</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
              <form onSubmit={handlePatientSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName" className="text-blue-900 text-sm">
                    Nome Completo
                  </Label>
                  <Input
                    id="patientName"
                    placeholder="Nome do paciente"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientPhone" className="text-blue-900 text-sm">
                    Telefone
                  </Label>
                  <Input
                    id="patientPhone"
                    placeholder="(11) 99999-9999"
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientEmail" className="text-blue-900 text-sm">
                    Email
                  </Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    placeholder="paciente@email.com"
                    value={newPatientEmail}
                    onChange={(e) => setNewPatientEmail(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm">
                    Cadastrar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPatientForm(false)}
                    className="flex-1 border-blue-200 text-blue-700 text-sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patient Search Modal */}
      {showPatientSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-md max-h-[95vh] flex flex-col">
            <CardHeader className="flex-shrink-0 p-4 sm:p-6">
              <CardTitle className="text-blue-900 text-lg">Buscar Paciente Cadastrado</CardTitle>
              <CardDescription className="text-blue-600 text-sm">Encontre um paciente no sistema</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="searchTerm" className="text-blue-900 text-sm">
                    Nome ou Email do Paciente
                  </Label>
                  <Input
                    id="searchTerm"
                    placeholder="Digite o nome ou email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-blue-900">Resultados:</h4>
                  <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                    {searchTerm && filteredRegisteredPatients.length > 0 ? (
                      filteredRegisteredPatients.map((patient) => (
                        <div key={patient.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="font-medium text-blue-900 truncate text-sm">{patient.name}</p>
                          <p className="text-xs text-blue-600 truncate">{patient.email}</p>
                          <p className="text-xs text-blue-600 truncate">{patient.phone}</p>
                        </div>
                      ))
                    ) : searchTerm ? (
                      <p className="text-blue-600 text-sm">Nenhum paciente encontrado com "{searchTerm}".</p>
                    ) : (
                      <p className="text-blue-600 text-sm">Digite para buscar pacientes cadastrados.</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => setShowPatientSearch(false)}
                    variant="outline"
                    className="border-blue-200 text-blue-700 text-sm"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
