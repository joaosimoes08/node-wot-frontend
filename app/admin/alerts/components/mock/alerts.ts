export const mockSensors = ['sensor01', 'sensor02', 'sensor03'];

export const mockAlerts = [
  {
    id: '1',
    name: 'Temperatura Alta',
    sensor: 'sensor01',
    metric: 'temperatura',
    condition: '>',
    value: 30,
    email: true,
    toast: true
  },
  {
    id: '2',
    name: 'CO₂ Crítico',
    sensor: 'sensor02',
    metric: 'co2',
    condition: '>',
    value: 1000,
    email: false,
    toast: true
  }
];
