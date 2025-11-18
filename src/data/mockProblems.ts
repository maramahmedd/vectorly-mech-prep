import { Problem } from '../types';

export const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Cantilever Beam Deflection',
    description: 'Calculate the maximum deflection of a cantilever beam under a point load at the free end.',
    detailedProblem: `A cantilever beam of length L = 3m is fixed at one end and free at the other. The beam has a rectangular cross-section with width b = 50mm and height h = 100mm. A point load P = 5kN is applied at the free end.

Given:
- Young's Modulus E = 200 GPa
- Length L = 3m
- Point Load P = 5kN at free end
- Cross-section: 50mm × 100mm

Calculate:
1. Maximum deflection at the free end
2. Maximum bending stress in the beam
3. Location and value of maximum shear stress

Show all calculations and relevant formulas used.`,
    difficulty: 'Easy',
    topic: 'Solid Mechanics',
    field: 'Mechanical',
    timeToSolve: 30,
    companies: ['Ford', 'Tesla', 'Boeing'],
    isFree: true,
    isStarred: false,
    hints: [
      'Use the deflection formula for a cantilever beam with point load: δ = PL³/3EI',
      'Calculate the moment of inertia I = bh³/12 for rectangular section',
      'Maximum bending stress occurs at the fixed end: σ = My/I'
    ],
    interviewContext: {
      position: 'Mechanical Design Engineer',
      round: 'Technical Round 1',
      focusArea: 'Structural Analysis & Beam Theory',
      evaluationCriteria: [
        'Understanding of beam deflection fundamentals',
        'Ability to apply theoretical formulas',
        'Unit conversion and calculation accuracy',
        'Knowledge of stress distribution'
      ]
    },
    quickReferences: [
      'Beam deflection formulas',
      'Moment of inertia reference',
      'Stress-strain relationships'
    ]
  },
  {
    id: '2',
    title: 'Carnot Cycle Efficiency',
    description: 'Determine the thermal efficiency of a Carnot engine operating between two temperature reservoirs.',
    detailedProblem: `A Carnot heat engine operates between a hot reservoir at 600K and a cold reservoir at 300K. The engine absorbs 1000 kJ of heat from the hot reservoir during each cycle.

Given:
- Hot reservoir temperature: TH = 600K
- Cold reservoir temperature: TC = 300K
- Heat absorbed from hot reservoir: QH = 1000 kJ

Calculate:
1. The thermal efficiency of the Carnot engine
2. Work output per cycle
3. Heat rejected to the cold reservoir
4. If the engine operates at 60 cycles per minute, calculate the power output

Explain the significance of Carnot efficiency as the theoretical maximum.`,
    difficulty: 'Easy',
    topic: 'Thermodynamics',
    field: 'Mechanical',
    timeToSolve: 25,
    companies: ['General Electric', 'Siemens', 'Rolls-Royce'],
    isFree: true,
    isStarred: false,
    hints: [
      'Carnot efficiency: η = 1 - TC/TH',
      'Work output: W = η × QH',
      'Energy conservation: QH = W + QC'
    ],
    interviewContext: {
      position: 'Thermal Systems Engineer',
      round: 'Technical Round 1',
      focusArea: 'Thermodynamic Cycles',
      evaluationCriteria: [
        'Understanding of Carnot cycle principles',
        'Temperature unit awareness (Kelvin)',
        'Energy balance calculations',
        'Power and work relationships'
      ]
    },
    quickReferences: [
      'Carnot cycle theory',
      'Thermodynamic efficiency formulas',
      'First law of thermodynamics'
    ]
  },
  {
    id: '3',
    title: 'Pressure Drop in Pipe Flow',
    description: 'Calculate the pressure drop in a horizontal pipe for turbulent flow of water.',
    detailedProblem: `Water at 20°C flows through a horizontal pipe with a diameter of 50mm and length of 100m. The average velocity of water is 2 m/s.

Given:
- Pipe diameter: D = 50mm = 0.05m
- Pipe length: L = 100m
- Average velocity: V = 2 m/s
- Water density: ρ = 998 kg/m³
- Dynamic viscosity: μ = 1.002 × 10⁻³ Pa·s
- Pipe roughness: ε = 0.046mm (commercial steel)

Calculate:
1. Reynolds number to confirm flow regime
2. Friction factor using the Moody chart or Colebrook equation
3. Pressure drop using Darcy-Weisbach equation
4. Pumping power required to overcome this pressure drop

Discuss whether the flow is laminar or turbulent.`,
    difficulty: 'Medium',
    topic: 'Fluid Mechanics',
    field: 'Mechanical',
    timeToSolve: 45,
    companies: ['Shell', 'ExxonMobil', 'Chevron'],
    isFree: true,
    isStarred: false,
    hints: [
      'Reynolds number: Re = ρVD/μ. Re > 4000 indicates turbulent flow',
      'For turbulent flow, use Colebrook equation or approximate with Swamee-Jain',
      'Darcy-Weisbach: ΔP = f(L/D)(ρV²/2)'
    ],
    interviewContext: {
      position: 'Fluid Systems Engineer',
      round: 'Technical Round 2',
      focusArea: 'Pipe Flow & Pressure Loss',
      evaluationCriteria: [
        'Flow regime identification',
        'Friction factor determination',
        'Application of Darcy-Weisbach equation',
        'Power calculations'
      ]
    },
    quickReferences: [
      'Reynolds number definition',
      'Moody chart',
      'Darcy-Weisbach equation'
    ]
  },
  {
    id: '4',
    title: 'Heat Exchanger Design',
    description: 'Design a counter-flow heat exchanger and calculate the required heat transfer area.',
    detailedProblem: `Design a counter-flow heat exchanger to cool hot oil using cold water.

Hot oil properties:
- Inlet temperature: 150°C
- Outlet temperature: 90°C
- Mass flow rate: 2 kg/s
- Specific heat: 2.1 kJ/(kg·K)

Cold water properties:
- Inlet temperature: 20°C
- Outlet temperature: 60°C
- Specific heat: 4.18 kJ/(kg·K)

Overall heat transfer coefficient: U = 300 W/(m²·K)

Calculate:
1. Heat transfer rate from the oil
2. Required mass flow rate of water
3. Log mean temperature difference (LMTD)
4. Required heat transfer area
5. Number of transfer units (NTU)

Verify energy balance and explain the advantages of counter-flow configuration.`,
    difficulty: 'Hard',
    topic: 'Heat Transfer',
    field: 'Mechanical',
    timeToSolve: 60,
    companies: ['Johnson Controls', 'Honeywell', 'Carrier'],
    isFree: true,
    isStarred: false,
    hints: [
      'Heat transfer rate: Q = ṁ × cp × ΔT for both fluids',
      'LMTD for counter-flow: LMTD = (ΔT1 - ΔT2)/ln(ΔT1/ΔT2)',
      'Heat exchanger equation: Q = U × A × LMTD'
    ],
    interviewContext: {
      position: 'HVAC Design Engineer',
      round: 'Technical Round 3',
      focusArea: 'Heat Exchanger Analysis & Design',
      evaluationCriteria: [
        'Energy balance understanding',
        'LMTD calculation accuracy',
        'Heat exchanger design methodology',
        'Understanding of flow configurations'
      ]
    },
    quickReferences: [
      'LMTD formulas',
      'Heat exchanger effectiveness-NTU method',
      'Fluid properties tables'
    ]
  },
  {
    id: '5',
    title: 'RC Circuit Transient Analysis',
    description: 'Analyze the transient response of an RC circuit when switched on.',
    detailedProblem: `An RC circuit consists of a resistor R = 10kΩ and a capacitor C = 100μF connected in series with a DC voltage source V = 12V. At t = 0, the switch is closed.

Given:
- Resistance: R = 10kΩ
- Capacitance: C = 100μF
- Source voltage: V = 12V
- Initial capacitor voltage: VC(0) = 0V

Calculate:
1. Time constant τ of the circuit
2. Voltage across capacitor as a function of time VC(t)
3. Current through the circuit as a function of time i(t)
4. Time required for capacitor to charge to 95% of final voltage
5. Energy stored in capacitor at steady state

Plot the voltage and current waveforms.`,
    difficulty: 'Medium',
    topic: 'Circuits',
    field: 'Electrical',
    timeToSolve: 40,
    companies: ['Intel', 'Texas Instruments', 'Analog Devices'],
    isFree: true,
    isStarred: false,
    hints: [
      'Time constant: τ = RC',
      'Capacitor voltage: VC(t) = V(1 - e^(-t/τ))',
      'Current: i(t) = (V/R)e^(-t/τ)'
    ],
    interviewContext: {
      position: 'Circuit Design Engineer',
      round: 'Technical Round 1',
      focusArea: 'Transient Circuit Analysis',
      evaluationCriteria: [
        'Understanding of RC time constant',
        'Exponential response analysis',
        'Energy storage in capacitors',
        'Ability to derive time-domain solutions'
      ]
    },
    quickReferences: [
      'RC circuit equations',
      'Exponential functions',
      'Capacitor energy formula'
    ]
  },
  {
    id: '6',
    title: 'Column Buckling Analysis',
    description: 'Determine the critical buckling load for a steel column under axial compression.',
    detailedProblem: `A steel column of circular cross-section is subjected to axial compression. Determine if the column will buckle under the applied load.

Given:
- Column length: L = 4m
- Outer diameter: D = 100mm
- Wall thickness: t = 5mm (hollow circular section)
- Young's Modulus: E = 200 GPa
- End conditions: Both ends pinned
- Applied axial load: P = 150 kN

Calculate:
1. Moment of inertia of the hollow circular section
2. Radius of gyration
3. Slenderness ratio
4. Critical buckling load using Euler's formula
5. Factor of safety against buckling

State whether the column is safe under the applied load.`,
    difficulty: 'Medium',
    topic: 'Structures',
    field: 'Civil',
    timeToSolve: 45,
    companies: ['Bechtel', 'AECOM', 'Jacobs Engineering'],
    isFree: false,
    isStarred: false,
    hints: [
      'For hollow circular section: I = π(D⁴ - d⁴)/64 where d = D - 2t',
      'Radius of gyration: r = √(I/A)',
      'Euler buckling load: Pcr = π²EI/(KL)² where K = 1 for pinned ends'
    ],
    interviewContext: {
      position: 'Structural Engineer',
      round: 'Technical Round 2',
      focusArea: 'Column Stability & Buckling',
      evaluationCriteria: [
        'Euler buckling theory understanding',
        'Section properties calculation',
        'End condition effects',
        'Safety factor interpretation'
      ]
    },
    quickReferences: [
      'Euler buckling formula',
      'Effective length factors',
      'Hollow section properties'
    ]
  },
  {
    id: '7',
    title: 'Stress Transformation',
    description: 'Determine principal stresses and maximum shear stress for a 2D stress state.',
    detailedProblem: `A material element is subjected to a plane stress state with the following stress components:

Given stress state:
- σx = 80 MPa (tensile)
- σy = 40 MPa (tensile)
- τxy = 30 MPa

Calculate:
1. Principal stresses σ1 and σ2
2. Angle of principal planes
3. Maximum in-plane shear stress
4. Angle of maximum shear stress planes
5. Construct Mohr's circle for the stress state

Verify your results using both analytical methods and Mohr's circle construction.`,
    difficulty: 'Hard',
    topic: 'Solid Mechanics',
    field: 'Mechanical',
    timeToSolve: 50,
    companies: ['Lockheed Martin', 'Northrop Grumman', 'Raytheon'],
    isFree: false,
    isStarred: false,
    hints: [
      'Principal stresses: σ1,2 = (σx + σy)/2 ± √[((σx - σy)/2)² + τxy²]',
      'Angle of principal plane: tan(2θp) = 2τxy/(σx - σy)',
      'Maximum shear stress: τmax = (σ1 - σ2)/2'
    ],
    interviewContext: {
      position: 'Stress Analysis Engineer',
      round: 'Technical Round 3',
      focusArea: 'Stress Analysis & Transformation',
      evaluationCriteria: [
        'Mohr\'s circle construction',
        'Principal stress calculations',
        'Understanding of stress transformation',
        'Graphical and analytical verification'
      ]
    },
    quickReferences: [
      'Stress transformation equations',
      'Mohr\'s circle theory',
      'Principal stress definition'
    ]
  },
  {
    id: '8',
    title: 'Three-Phase Power Calculation',
    description: 'Calculate power consumption and power factor correction for a three-phase industrial load.',
    detailedProblem: `An industrial facility has a three-phase balanced load connected to a 480V, 60Hz supply.

Load characteristics:
- Line voltage: VL = 480V
- Line current: IL = 100A
- Power factor: pf = 0.7 lagging
- Connection: Wye (Y) connected

Calculate:
1. Real power (P) consumed by the load
2. Reactive power (Q) consumed
3. Apparent power (S)
4. Required capacitance per phase to improve power factor to 0.95
5. New line current after power factor correction

Explain the economic benefits of power factor correction.`,
    difficulty: 'Hard',
    topic: 'Circuits',
    field: 'Electrical',
    timeToSolve: 55,
    companies: ['Schneider Electric', 'ABB', 'Eaton'],
    isFree: false,
    isStarred: false,
    hints: [
      'For three-phase: P = √3 × VL × IL × cos(φ)',
      'Reactive power: Q = √3 × VL × IL × sin(φ)',
      'Additional reactive power needed: Qc = P(tan(φ1) - tan(φ2))'
    ],
    interviewContext: {
      position: 'Power Systems Engineer',
      round: 'Technical Round 2',
      focusArea: 'Three-Phase Systems & Power Quality',
      evaluationCriteria: [
        'Three-phase power calculations',
        'Power factor correction methodology',
        'Capacitor sizing',
        'Economic justification understanding'
      ]
    },
    quickReferences: [
      'Three-phase power formulas',
      'Power triangle relationships',
      'Capacitor reactive power'
    ]
  },
  {
    id: '9',
    title: 'Material Selection for High Temperature',
    description: 'Select appropriate material for a high-temperature pressure vessel application.',
    detailedProblem: `You are designing a pressure vessel that will operate at high temperatures. The vessel must withstand both pressure and thermal stresses.

Operating conditions:
- Internal pressure: 5 MPa
- Operating temperature: 600°C
- Design life: 20 years
- Corrosive environment: Moderate
- Safety factor: 4

Material options:
A) Carbon Steel (yield: 250 MPa at RT, softens significantly at 600°C)
B) Stainless Steel 316 (yield: 205 MPa at RT, 135 MPa at 600°C)
C) Inconel 625 (yield: 415 MPa at RT, 345 MPa at 600°C)

Tasks:
1. Evaluate each material for suitability
2. Consider creep resistance at 600°C
3. Calculate required wall thickness for a cylindrical vessel (ID = 1m)
4. Consider corrosion allowance
5. Make material recommendation with justification
6. Discuss cost-performance trade-offs`,
    difficulty: 'Hard',
    topic: 'Materials',
    field: 'Mechanical',
    timeToSolve: 60,
    companies: ['Chevron', 'Saudi Aramco', 'Shell'],
    isFree: false,
    isStarred: false,
    hints: [
      'For thin-walled cylinder: t = PD/(2σ × η) where η is joint efficiency',
      'Consider high-temperature properties, not room temperature',
      'Creep becomes significant above 0.4 × melting temperature'
    ],
    interviewContext: {
      position: 'Materials Engineer',
      round: 'Technical Round 3',
      focusArea: 'Material Selection & High-Temperature Design',
      evaluationCriteria: [
        'Understanding of temperature effects on materials',
        'Creep considerations',
        'Pressure vessel design codes',
        'Economic decision making'
      ]
    },
    quickReferences: [
      'Pressure vessel formulas',
      'Material properties at elevated temperatures',
      'ASME codes for pressure vessels'
    ]
  },
  {
    id: '10',
    title: 'Building Load Analysis',
    description: 'Calculate dead and live loads for a residential building floor design.',
    detailedProblem: `Design a floor system for a residential building and calculate the total loads.

Building specifications:
- Floor dimensions: 6m × 8m
- Concrete slab thickness: 150mm
- Ceramic tile flooring: 20mm thick
- Ceiling and services: 0.5 kN/m²
- Live load for residential: 2.0 kN/m² (code requirement)

Material properties:
- Concrete density: 25 kN/m³
- Ceramic tile density: 23 kN/m³

Calculate:
1. Dead load from concrete slab
2. Dead load from floor finish
3. Total dead load per unit area
4. Total dead load for entire floor
5. Total live load for the floor
6. Load combinations as per code (consider 1.2DL + 1.6LL)
7. Total factored load on floor

Present your calculations in a clear, organized manner suitable for structural design documentation.`,
    difficulty: 'Easy',
    topic: 'Structures',
    field: 'Civil',
    timeToSolve: 35,
    companies: ['Turner Construction', 'Skanska', 'Kiewit'],
    isFree: false,
    isStarred: false,
    hints: [
      'Dead load = thickness × density × area',
      'Convert mm to m for calculations',
      'Load combination: Total = 1.2 × Dead Load + 1.6 × Live Load'
    ],
    interviewContext: {
      position: 'Structural Design Engineer',
      round: 'Technical Round 1',
      focusArea: 'Load Analysis & Building Codes',
      evaluationCriteria: [
        'Understanding of load types',
        'Unit conversions',
        'Load combination knowledge',
        'Building code familiarity'
      ]
    },
    quickReferences: [
      'Building code load requirements',
      'Material density tables',
      'Load combination factors'
    ]
  },
  {
    id: '11',
    title: 'Pump Selection and System Design',
    description: 'Select an appropriate pump for a water distribution system.',
    detailedProblem: `Design a pumping system to deliver water from a ground reservoir to an overhead tank.

System parameters:
- Flow rate required: Q = 50 L/s
- Vertical lift: 25m
- Horizontal pipe length: 100m
- Pipe diameter: 150mm
- Total minor losses coefficient: K = 8
- Pipe friction factor: f = 0.02
- Efficiency of pump: 75%

Calculate:
1. Velocity of water in pipe
2. Head loss due to friction (major losses)
3. Head loss due to fittings (minor losses)
4. Total dynamic head (TDH)
5. Hydraulic power required
6. Electrical power input to pump
7. Recommend pump type and specifications

Consider system curve and pump characteristic curve in your analysis.`,
    difficulty: 'Medium',
    topic: 'Fluid Mechanics',
    field: 'Mechanical',
    timeToSolve: 50,
    companies: ['Grundfos', 'Sulzer', 'Flowserve'],
    isFree: false,
    isStarred: false,
    hints: [
      'Velocity: V = Q/A where A = πD²/4',
      'Major losses: hf = f(L/D)(V²/2g)',
      'Minor losses: hm = K(V²/2g)'
    ],
    interviewContext: {
      position: 'Pumping Systems Engineer',
      round: 'Technical Round 2',
      focusArea: 'Pump Selection & Hydraulic Systems',
      evaluationCriteria: [
        'Head loss calculations',
        'Pump sizing methodology',
        'Efficiency considerations',
        'System analysis approach'
      ]
    },
    quickReferences: [
      'Pump affinity laws',
      'Head loss equations',
      'Pump selection charts'
    ]
  },
  {
    id: '12',
    title: 'HVAC Cooling Load Estimation',
    description: 'Calculate the cooling load for an office space to size the air conditioning system.',
    detailedProblem: `Estimate the cooling load for an office space to properly size the HVAC system.

Office specifications:
- Dimensions: 10m × 12m × 3m (L × W × H)
- Occupancy: 20 people
- Lighting: 15 W/m²
- Equipment: 10 computers (200W each), 2 printers (500W each)
- External walls: South and East facing (total 66m²)
- Windows: 20% of external wall area, single glazed
- Outdoor temperature: 40°C
- Indoor design temperature: 24°C
- Infiltration: 0.5 air changes per hour

Heat gain factors:
- Metabolic heat per person: 120W
- U-value for walls: 2.5 W/(m²·K)
- U-value for windows: 5.5 W/(m²·K)
- Solar heat gain through windows: 200 W/m²

Calculate:
1. Heat gain from occupants
2. Heat gain from lighting
3. Heat gain from equipment
4. Heat gain through walls
5. Heat gain through windows (conduction + solar)
6. Heat gain from infiltration
7. Total cooling load (in kW and tons of refrigeration)
8. Recommend AC capacity with safety factor`,
    difficulty: 'Hard',
    topic: 'Heat Transfer',
    field: 'Architecture',
    timeToSolve: 60,
    companies: ['Trane', 'Daikin', 'Carrier'],
    isFree: false,
    isStarred: false,
    hints: [
      'Conduction heat gain: Q = U × A × ΔT',
      'Infiltration: Q = ṁ × cp × ΔT, where ṁ = ρ × Volume × ACH',
      '1 ton of refrigeration = 3.517 kW'
    ],
    interviewContext: {
      position: 'HVAC Design Engineer',
      round: 'Technical Round 2',
      focusArea: 'Cooling Load Calculations',
      evaluationCriteria: [
        'Heat gain component identification',
        'Cooling load calculation methodology',
        'Unit conversions',
        'Safety factor application'
      ]
    },
    quickReferences: [
      'ASHRAE cooling load guidelines',
      'Heat transfer formulas',
      'Psychrometric charts'
    ]
  }
];
