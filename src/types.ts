export type Agent = {
  accountId: string;
  credits: number;
  headquarters: string;
  shipCount: number;
  startingFaction: string;
  symbol: string;
};

export type Ship = {
  symbol: string;
  registration: {
    name: string;
    factionSymbol: string;
    role: string;
  };
  nav: {
    systemSymbol: string;
    waypointSymbol: string;
    route: {
      destination: {
        symbol: string;
        type: string;
        systemSymbol: string;
        x: number;
        y: number;
      };
      origin: {
        symbol: string;
        type: string;
        systemSymbol: string;
        x: number;
        y: number;
      };
      departureTime: string;
      arrival: string;
    };
    status: string;
    flightMode: string;
  };
  crew: {
    current: number;
    required: number;
    capacity: number;
    rotation: string;
    morale: number;
    wages: number;
  };
  frame: {
    symbol: string;
    name: string;
    condition: number;
    integrity: number;
    description: string;
    moduleSlots: number;
    mountingPoints: number;
    fuelCapacity: number;
    requirements: {
      power: number;
      crew: number;
      slots: number;
    };
    quality: number;
  };
  reactor: {
    symbol: string;
    name: string;
    condition: number;
    integrity: number;
    description: string;
    powerOutput: number;
    requirements: {
      power: number;
      crew: number;
      slots: number;
    };
    quality: number;
  };
  engine: {
    symbol: string;
    name: string;
    condition: number;
    integrity: number;
    description: string;
    speed: number;
    requirements: {
      power: number;
      crew: number;
      slots: number;
    };
    quality: number;
  };
  modules: Array<{
    symbol: string;
    name: string;
    description: string;
    capacity?: number;
    range?: number;
    requirements: {
      power: number;
      crew: number;
      slots: number;
    };
  }>;
  mounts: Array<{
    symbol: string;
    name: string;
    description: string;
    strength?: number;
    deposits?: string[];
    requirements: {
      power: number;
      crew: number;
      slots: number;
    };
  }>;
  cargo: {
    capacity: number;
    units: number;
    inventory: Array<{
      symbol: string;
      name: string;
      description: string;
      units: number;
    }>;
  };
  fuel: {
    current: number;
    capacity: number;
    consumed?: {
      amount: number;
      timestamp: string;
    };
  };
  cooldown?: {
    shipSymbol: string;
    totalSeconds: number;
    remainingSeconds: number;
    expiration: string;
  };
};

export type Nav = {
  systemSymbol: string;
  waypointSymbol: string;
  route: {
    destination: {
      symbol: string;
      type: string;
      systemSymbol: string;
      x: number;
      y: number;
    };
    origin: {
      symbol: string;
      type: string;
      systemSymbol: string;
      x: number;
      y: number;
    };
    departureTime: string;
    arrival: string;
  };
  status: string;
  flightMode: string;
};

export type ServerStatus = {
  status: string;
  version: string;
  resetDate: string;
  description: string;
  stats: {
    accounts: number;
    agents: number;
    ships: number;
    systems: number;
    waypoints: number;
  };
  health: {
    lastMarketUpdate: string;
  };
  leaderboards: {
    mostCredits: Array<{
      agentSymbol: string;
      credits: number;
    }>;
    mostSubmittedCharts: Array<{
      agentSymbol: string;
      chartCount: number;
    }>;
  };
  serverResets: {
    next: string;
    frequency: string;
  };
  announcements: Array<{
    title: string;
    body: string;
  }>;
  links: Array<{
    name: string;
    url: string;
  }>;
};
