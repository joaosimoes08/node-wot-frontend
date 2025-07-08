type Alert = {
  name: string
  sensor: string
  metric: string
  condition: string
  threshold: number
  sendEmail: boolean
  sendToast: boolean
}

let alertStore: Alert[] = [
  {
    name: "Temperatura Crítica",
    sensor: "sensor01",
    metric: "temperatura",
    condition: ">",
    threshold: 30,
    sendEmail: true,
    sendToast: true,
  },
  {
    name: "CO₂ Alto",
    sensor: "sensor02",
    metric: "co2",
    condition: ">",
    threshold: 1000,
    sendEmail: false,
    sendToast: true,
  },
  {
    name: "TVOC Abaixo",
    sensor: "sensor01",
    metric: "tvoc",
    condition: "<",
    threshold: 10,
    sendEmail: true,
    sendToast: false,
  },
]

export function saveAlert(alert: Alert) {
  alertStore.push(alert)
}

export function getAlerts(): Alert[] {
  return alertStore
}
