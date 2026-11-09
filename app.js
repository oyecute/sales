/**
 * SalesPulse Analytics Dashboard
 * Pure Vanilla JavaScript Implementation
 * Persistent Data via WebStorage (localStorage)
 * Zero CSS Variables - Complete Offline Fallback
 */

(function () {
  'use strict';

  // LocalStorage Key
  const STORAGE_KEY = 'salespulse_analytics_records_v1';
  const TARGET_MONTHLY_QUOTA = 150000;

  // Chart instances
  let revenueTrendChartInstance = null;
  let categoryDonutChartInstance = null;
  let channelBarChartInstance = null;

  // Application State
  const state = {
    records: [],
    filters: {
      period: 'this-month',
      category: 'all',
      channel: 'all',
      status: 'all',
      search: '',
      sort: 'date-desc'
    },
    pagination: {
      currentPage: 1,
      pageSize: 8
    },
    pendingDeleteId: null
  };

  // Color constants for charts & indicators (Strictly NO CSS variables used)
  const COLOR_PALETTE = {
    Software: '#2563eb',       // Blue
    Hardware: '#8b5cf6',       // Purple
    Services: '#10b981',       // Emerald
    Consulting: '#f59e0b',     // Amber
    Subscriptions: '#06b6d4'   // Cyan
  };

  const CHANNEL_COLORS = {
    'Direct Sales': '#3b82f6',
    'Online Store': '#10b981',
    'Partner': '#8b5cf6',
    'Wholesale': '#f59e0b'
  };

  // =========================================================================
  // Initial Sample Seed Data Generator (Spans Q3/Q4 2026)
  // =========================================================================
  function getSampleSeedData() {
    return [
      {
        id: 'TX-9401',
        date: '2026-11-09',
        customer: 'Apex Global Logistics',
        email: 'procurement@apexlogistics.com',
        product: 'Enterprise Fleet Monitoring API',
        category: 'Software',
        channel: 'Direct Sales',
        amount: 8400.00,
        cost: 1680.00,
        status: 'Completed'
      },
      {
        id: 'TX-9402',
        date: '2026-11-09',
        customer: 'Starlight Retailers Inc',
        email: 'billing@starlightretail.org',
        product: 'POS Hardware Terminal Bundle',
        category: 'Hardware',
        channel: 'Wholesale',
        amount: 4200.00,
        cost: 2450.00,
        status: 'Completed'
      },
      {
        id: 'TX-9403',
        date: '2026-11-08',
        customer: 'CloudScale Ventures',
        email: 'accounts@cloudscale.vc',
        product: 'Architecture Security Audit',
        category: 'Consulting',
        channel: 'Partner',
        amount: 6500.00,
        cost: 1200.00,
        status: 'Completed'
      },
      {
        id: 'TX-9404',
        date: '2026-11-08',
        customer: 'Vanguard Medical Labs',
        email: 'it-purchasing@vanguardmed.net',
        product: 'HIPAA Compliance Cloud Suite',
        category: 'Software',
        channel: 'Direct Sales',
        amount: 9800.00,
        cost: 1950.00,
        status: 'Completed'
      },
      {
        id: 'TX-9405',
        date: '2026-11-07',
        customer: 'Urban Haven Studios',
        email: 'hello@urbanhaven.design',
        product: 'Team Creative Pro Plan',
        category: 'Subscriptions',
        channel: 'Online Store',
        amount: 1450.00,
        cost: 190.00,
        status: 'Completed'
      },
      {
        id: 'TX-9406',
        date: '2026-11-07',
        customer: 'Helios Robotics',
        email: 'dev@heliosrobotics.ai',
        product: 'Edge Sensor Nodes (10x)',
        category: 'Hardware',
        channel: 'Online Store',
        amount: 3800.00,
        cost: 2100.00,
        status: 'Pending'
      },
      {
        id: 'TX-9407',
        date: '2026-11-06',
        customer: 'Krypton Cyber Defense',
        email: 'ops@kryptoncyber.com',
        product: 'Managed Threat Monitoring',
        category: 'Services',
        channel: 'Direct Sales',
        amount: 5400.00,
        cost: 1400.00,
        status: 'Completed'
      },
      {
        id: 'TX-9408',
        date: '2026-11-06',
        customer: 'Beacon Digital Media',
        email: 'finance@beacondigital.io',
        product: 'Ad Attribution Platform',
        category: 'Subscriptions',
        channel: 'Online Store',
        amount: 1200.00,
        cost: 180.00,
        status: 'Completed'
      },
      {
        id: 'TX-9409',
        date: '2026-11-05',
        customer: 'Silverline Finance Group',
        email: 'settlements@silverline.co',
        product: 'High-Frequency Analytics Addon',
        category: 'Software',
        channel: 'Partner',
        amount: 11200.00,
        cost: 2300.00,
        status: 'Completed'
      },
      {
        id: 'TX-9410',
        date: '2026-11-05',
        customer: 'BlueWave eCommerce',
        email: 'orders@bluewave.store',
        product: 'High-Speed Label Printers',
        category: 'Hardware',
        channel: 'Wholesale',
        amount: 2750.00,
        cost: 1800.00,
        status: 'Refunded'
      },
      {
        id: 'TX-9411',
        date: '2026-11-04',
        customer: 'Zenith BioPharma',
        email: 'rnd-ops@zenithbio.com',
        product: 'Data Governance Framework',
        category: 'Consulting',
        channel: 'Direct Sales',
        amount: 7200.00,
        cost: 1600.00,
        status: 'Completed'
      },
      {
        id: 'TX-9412',
        date: '2026-11-04',
        customer: 'Evergreen Agritech',
        email: 'support@evergreen-agri.org',
        product: 'Precision Drone Software Kit',
        category: 'Software',
        channel: 'Direct Sales',
        amount: 4900.00,
        cost: 950.00,
        status: 'Completed'
      },
      {
        id: 'TX-9413',
        date: '2026-11-03',
        customer: 'Solstice Solar Systems',
        email: 'install@solsticesolar.com',
        product: 'Commercial Inverter Controllers',
        category: 'Hardware',
        channel: 'Direct Sales',
        amount: 6800.00,
        cost: 4100.00,
        status: 'Completed'
      },
      {
        id: 'TX-9414',
        date: '2026-11-03',
        customer: 'Pinnacle Law Partners',
        email: 'admin@pinnaclelegal.com',
        product: 'Document Encryption Portal',
        category: 'Subscriptions',
        channel: 'Online Store',
        amount: 1950.00,
        cost: 220.00,
        status: 'Completed'
      },
      {
        id: 'TX-9415',
        date: '2026-11-02',
        customer: 'OmniTrade Commodities',
        email: 'desk@omnitrade.ch',
        product: 'Cloud Integration & Migration',
        category: 'Services',
        channel: 'Partner',
        amount: 8600.00,
        cost: 2900.00,
        status: 'Completed'
      },
      {
        id: 'TX-9416',
        date: '2026-11-02',
        customer: 'Atlas Logistics Hub',
        email: 'dockmaster@atlaslogistics.com',
        product: 'Automated Barcode Scanners',
        category: 'Hardware',
        channel: 'Wholesale',
        amount: 3400.00,
        cost: 2150.00,
        status: 'Completed'
      },
      {
        id: 'TX-9417',
        date: '2026-11-01',
        customer: 'Quantum Stream Entertainment',
        email: 'licensing@quantumstream.tv',
        product: 'Video CDN Compression License',
        category: 'Software',
        channel: 'Direct Sales',
        amount: 12500.00,
        cost: 2600.00,
        status: 'Completed'
      },
      {
        id: 'TX-9418',
        date: '2026-11-01',
        customer: 'Hyperion Capital',
        email: 'investor@hyperioncap.com',
        product: 'Quarterly Risk Assessment',
        category: 'Consulting',
        channel: 'Direct Sales',
        amount: 5000.00,
        cost: 1100.00,
        status: 'Completed'
      },
      {
        id: 'TX-9419',
        date: '2026-10-30',
        customer: 'Redwood Education Tech',
        email: 'it@redwoodedu.org',
        product: 'Classroom Virtual Labs (50 seats)',
        category: 'Software',
        channel: 'Online Store',
        amount: 4500.00,
        cost: 800.00,
        status: 'Completed'
      },
      {
        id: 'TX-9420',
        date: '2026-10-29',
        customer: 'TerraFirm Engineering',
        email: 'surveys@terrafirm.co.uk',
        product: 'Site Telemetry Gateway',
        category: 'Hardware',
        channel: 'Partner',
        amount: 5100.00,
        cost: 3200.00,
        status: 'Completed'
      },
      {
        id: 'TX-9421',
        date: '2026-10-28',
        customer: 'Orbit Gaming Studios',
        email: 'producer@orbitgames.dev',
        product: 'Cloud Compute Instance (Annual)',
        category: 'Subscriptions',
        channel: 'Online Store',
        amount: 3200.00,
        cost: 480.00,
        status: 'Completed'
      },
      {
        id: 'TX-9422',
        date: '2026-10-27',
        customer: 'NorthStar Health Systems',
        email: 'supply@northstarhealth.com',
        product: 'Patient Intake Portal License',
        category: 'Software',
        channel: 'Direct Sales',
        amount: 9400.00,
        cost: 1850.00,
        status: 'Completed'
      },
      {
        id: 'TX-9423',
        date: '2026-10-26',
        customer: 'Summit Peak Hospitality',
        email: 'gm@summitpeakhospitality.com',
        product: 'Guest Network Routers (Set)',
        category: 'Hardware',
        channel: 'Wholesale',
        amount: 2900.00,
        cost: 1750.00,
        status: 'Refunded'
      },
      {
        id: 'TX-9424',
        date: '2026-10-25',
        customer: 'Vector Aerospace',
        email: 'avionics@vectoraero.com',
        product: 'Telemetry Pipeline Integration',
        category: 'Services',
        channel: 'Direct Sales',
        amount: 14200.00,
        cost: 3800.00,
        status: 'Completed'
      },
      {
        id: 'TX-9425',
        date: '2026-10-24',
        customer: 'Cascade Beverage Co',
        email: 'plantmanager@cascadebev.com',
        product: 'Inventory Tracking Sensors',
        category: 'Hardware',
        channel: 'Direct Sales',
        amount: 6100.00,
        cost: 3600.00,
        status: 'Completed'
      },
      {
        id: 'TX-9426',
        date: '2026-10-23',
        customer: 'Ironclad Logistics',
        email: 'dispatch@ironclad.io',
        product: 'Fleet Optimization Engine',
        category: 'Software',
        channel: 'Partner',
        amount: 7800.00,
        cost: 1500.00,
        status: 'Completed'
      },
      {
        id: 'TX-9427',
        date: '2026-10-22',
        customer: 'Pacific Shore Architects',
        email: 'cad@pacificshore.arch',
        product: 'Rendering Cluster Subscription',
        category: 'Subscriptions',
        channel: 'Online Store',
        amount: 2400.00,
        cost: 350.00,
        status: 'Completed'
      },
      {
        id: 'TX-9428',
        date: '2026-10-20',
        customer: 'Frontier Energy Solutions',
        email: 'grid@frontierenergy.org',
        product: 'Grid Stability Workshop & Audit',
        category: 'Consulting',
        channel: 'Direct Sales',
        amount: 8500.00,
        cost: 2100.00,
        status: 'Completed'
      },
      {
        id: 'TX-9429',
        date: '2026-10-18',
        customer: 'NextGen Financial',
        email: 'fintech@nextgenfi.com',
        product: 'Compliance Reporting Engine',
        category: 'Software',
        channel: 'Direct Sales',
        amount: 10400.00,
        cost: 2100.00,
        status: 'Completed'
      },
      {
        id: 'TX-9430',
        date: '2026-10-15',
        customer: 'GreenPulse Supermarkets',
        email: 'storeops@greenpulse.com',
        product: 'Thermal Receipt Printers (25x)',
        category: 'Hardware',
        channel: 'Wholesale',
        amount: 3750.00,
        cost: 2400.00,
        status: 'Completed'
      },
      {
        id: 'TX-9431',
        date: '2026-10-12',
        customer: 'Aura Media Group',
        email: 'accounts@auramedia.net',
        product: 'Video Asset Management SaaS',
        category: 'Subscriptions',
        channel: 'Online Store',
        amount: 1800.00,
        cost: 260.00,
        status: 'Completed'
      },
      {
        id: 'TX-9432',
        date: '2026-10-09',
        customer: 'Titanium Security Systems',
        email: 'ciso@titaniumsec.com',
        product: 'Penetration Testing Service',
        category: 'Services',
        channel: 'Direct Sales',
        amount: 9200.00,
        cost: 2700.00,
        status: 'Completed'
      },
      {
        id: 'TX-9433',
        date: '2026-10-05',
        customer: 'Zephyr Drone Dynamics',
        email: 'avionics@zephyrdynamics.com',
        product: 'Flight Controller Modules',
        category: 'Hardware',
        channel: 'Partner',
        amount: 4600.00,
        cost: 2900.00,
        status: 'Pending'
      },
      {
        id: 'TX-9434',
        date: '2026-10-02',
        customer: 'Crestview Analytics',
        email: 'billing@crestview.ai',
        product: 'Big Data Pipeline Architecting',
        category: 'Consulting',
        channel: 'Direct Sales',
        amount: 6300.00,
        cost: 1400.00,
        status: 'Completed'
      }
    ];
  }

  // =========================================================================
  // LocalStorage Helper Methods
  // =========================================================================
  function loadRecordsFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage data, restoring sample seed.', e);
    }
    const seed = getSampleSeedData();
    saveRecordsToStorage(seed);
    return seed;
  }

  function saveRecordsToStorage(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      showToast('Storage quota exceeded or unavailable', 'danger');
    }
  }

  // =========================================================================
  // Utilities: Formatting & Calculations
  // =========================================================================
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num || 0);
  }

  function formatDateDisplay(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return dateString;
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'danger' ? 'toast-danger' : 'toast-success'}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, 2800);
  }

  // =========================================================================
  // Date Filtering & Comparison Range Logic
  // Reference Anchor Date: Nov 9, 2026 (matching system local time)
  // =========================================================================
  function getReferenceToday() {
    return new Date(2026, 10, 9); // Month is 0-indexed: 10 = Nov
  }

  function parseISODate(dateStr) {
    const parts = dateStr.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  function isRecordInDateRange(recordDateStr, period) {
    if (period === 'all') return true;

    const recDate = parseISODate(recordDateStr);
    const today = getReferenceToday();

    if (period === 'this-month') {
      return recDate.getFullYear() === today.getFullYear() && recDate.getMonth() === today.getMonth();
    }

    if (period === 'last-7') {
      const cutoff = new Date(today);
      cutoff.setDate(today.getDate() - 7);
      return recDate >= cutoff && recDate <= today;
    }

    if (period === 'last-30') {
      const cutoff = new Date(today);
      cutoff.setDate(today.getDate() - 30);
      return recDate >= cutoff && recDate <= today;
    }

    if (period === 'this-quarter') {
      // Q4: Oct 1 - Dec 31, 2026
      return recDate.getFullYear() === 2026 && recDate.getMonth() >= 9 && recDate.getMonth() <= 11;
    }

    return true;
  }

  function isRecordInPreviousCycle(recordDateStr, period) {
    const recDate = parseISODate(recordDateStr);
    const today = getReferenceToday();

    if (period === 'this-month') {
      // Previous month: October 2026
      const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
      const prevYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
      return recDate.getFullYear() === prevYear && recDate.getMonth() === prevMonth;
    }

    if (period === 'last-7') {
      const start = new Date(today);
      start.setDate(today.getDate() - 14);
      const end = new Date(today);
      end.setDate(today.getDate() - 7);
      return recDate >= start && recDate < end;
    }

    if (period === 'last-30') {
      const start = new Date(today);
      start.setDate(today.getDate() - 60);
      const end = new Date(today);
      end.setDate(today.getDate() - 30);
      return recDate >= start && recDate < end;
    }

    if (period === 'this-quarter') {
      // Previous quarter Q3: July 1 - Sept 30, 2026
      return recDate.getFullYear() === 2026 && recDate.getMonth() >= 6 && recDate.getMonth() <= 8;
    }

    return false;
  }

  // =========================================================================
  // Filtering & Query Engine
  // =========================================================================
  function getFilteredRecords() {
    return state.records.filter(item => {
      // Date filter
      if (!isRecordInDateRange(item.date, state.filters.period)) {
        return false;
      }
      // Category filter
      if (state.filters.category !== 'all' && item.category !== state.filters.category) {
        return false;
      }
      // Channel filter
      if (state.filters.channel !== 'all' && item.channel !== state.filters.channel) {
        return false;
      }
      return true;
    });
  }

  function getTableQueriedRecords() {
    const filtered = getFilteredRecords();

    return filtered.filter(item => {
      // Status filter
      if (state.filters.status !== 'all' && item.status !== state.filters.status) {
        return false;
      }

      // Search query
      if (state.filters.search.trim() !== '') {
        const q = state.filters.search.toLowerCase().trim();
        const matchCustomer = item.customer.toLowerCase().includes(q);
        const matchEmail = item.email.toLowerCase().includes(q);
        const matchProduct = item.product.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        if (!matchCustomer && !matchEmail && !matchProduct && !matchId && !matchCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (state.filters.sort) {
        case 'date-asc':
          return a.date.localeCompare(b.date);
        case 'date-desc':
          return b.date.localeCompare(a.date);
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        case 'customer-asc':
          return a.customer.localeCompare(b.customer);
        default:
          return b.date.localeCompare(a.date);
      }
    });
  }

  // =========================================================================
  // KPI Metrics Calculation & Rendering
  // =========================================================================
  function updateKPIs() {
    const currentRecords = getFilteredRecords();

    // Current metrics
    let totalRevenue = 0;
    let totalCost = 0;
    let completedOrders = 0;
    let pendingCount = 0;
    let refundedCount = 0;

    currentRecords.forEach(item => {
      if (item.status === 'Completed') {
        totalRevenue += Number(item.amount);
        totalCost += Number(item.cost || 0);
        completedOrders++;
      } else if (item.status === 'Pending') {
        pendingCount++;
      } else if (item.status === 'Refunded') {
        refundedCount++;
      }
    });

    const netProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
    const totalTransactions = currentRecords.length;
    const refundRate = totalTransactions > 0 ? (refundedCount / totalTransactions) * 100 : 0;

    // Previous cycle metrics for trend calculation
    let prevRevenue = 0;
    let prevCompletedOrders = 0;
    state.records.forEach(item => {
      if (isRecordInPreviousCycle(item.date, state.filters.period) && item.status === 'Completed') {
        if (state.filters.category === 'all' || item.category === state.filters.category) {
          if (state.filters.channel === 'all' || item.channel === state.filters.channel) {
            prevRevenue += Number(item.amount);
            prevCompletedOrders++;
          }
        }
      }
    });

    // Trend percentages
    const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const ordersGrowth = prevCompletedOrders > 0 ? ((completedOrders - prevCompletedOrders) / prevCompletedOrders) * 100 : 0;

    // Update DOM Elements
    document.getElementById('kpi-total-revenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('kpi-net-profit').textContent = formatCurrency(netProfit);
    document.getElementById('kpi-total-orders').textContent = formatNumber(completedOrders);
    document.getElementById('kpi-avg-order-value').textContent = formatCurrency(avgOrderValue);
    document.getElementById('kpi-refund-rate').textContent = refundRate.toFixed(1) + '%';
    document.getElementById('kpi-margin-badge').textContent = profitMargin.toFixed(1) + '% Margin';
    document.getElementById('kpi-pending-count').textContent = `${pendingCount} Pending sales`;

    // Trend badge styling
    const revTrendEl = document.getElementById('kpi-revenue-trend');
    if (state.filters.period === 'all') {
      revTrendEl.className = 'kpi-trend neutral';
      revTrendEl.textContent = 'Lifetime';
    } else {
      const sign = revenueGrowth >= 0 ? '+' : '';
      revTrendEl.className = `kpi-trend ${revenueGrowth >= 0 ? 'positive' : 'negative'}`;
      revTrendEl.textContent = `${sign}${revenueGrowth.toFixed(1)}%`;
    }

    const orderTrendEl = document.getElementById('kpi-orders-trend');
    if (state.filters.period === 'all') {
      orderTrendEl.className = 'kpi-trend neutral';
      orderTrendEl.textContent = 'All Time';
    } else {
      const sign = ordersGrowth >= 0 ? '+' : '';
      orderTrendEl.className = `kpi-trend ${ordersGrowth >= 0 ? 'positive' : 'negative'}`;
      orderTrendEl.textContent = `${sign}${ordersGrowth.toFixed(1)}%`;
    }

    // Update Target / Quota Attainment
    updateGoalWidget(totalRevenue);
  }

  // =========================================================================
  // Target Progress Widget & Dynamic Insights
  // =========================================================================
  function updateGoalWidget(totalRevenue) {
    const pct = Math.min(Math.round((totalRevenue / TARGET_MONTHLY_QUOTA) * 100), 100);
    const fillEl = document.getElementById('goal-progress-fill');
    const badgeEl = document.getElementById('goal-attainment-pct');
    const currentEl = document.getElementById('goal-current-amount');
    const remainEl = document.getElementById('goal-remaining-val');
    const projectedEl = document.getElementById('goal-projected-val');
    const pacingEl = document.getElementById('goal-pacing-status');
    const intelEl = document.getElementById('intel-summary-text');

    fillEl.style.width = pct + '%';
    badgeEl.textContent = `${pct}% of Target`;
    currentEl.textContent = formatCurrency(totalRevenue);

    const remaining = Math.max(0, TARGET_MONTHLY_QUOTA - totalRevenue);
    remainEl.textContent = formatCurrency(remaining);

    // Projected Month End calculation (day 9 of 30)
    const dayOfMonth = 9;
    const projected = dayOfMonth > 0 ? (totalRevenue / dayOfMonth) * 30 : totalRevenue;
    projectedEl.textContent = formatCurrency(projected);

    if (projected >= TARGET_MONTHLY_QUOTA) {
      pacingEl.textContent = 'Exceeding Target';
      pacingEl.style.color = '#059669';
    } else if (projected >= TARGET_MONTHLY_QUOTA * 0.85) {
      pacingEl.textContent = 'On Track';
      pacingEl.style.color = '#2563eb';
    } else {
      pacingEl.textContent = 'Behind Pace';
      pacingEl.style.color = '#e11d48';
    }

    // Dynamic Automated Sales Intel Callout
    const currentRecords = getFilteredRecords();
    const categoryTotals = {};
    const channelTotals = {};

    currentRecords.filter(r => r.status === 'Completed').forEach(r => {
      categoryTotals[r.category] = (categoryTotals[r.category] || 0) + Number(r.amount);
      channelTotals[r.channel] = (channelTotals[r.channel] || 0) + Number(r.amount);
    });

    let topCategory = 'Software';
    let topCatAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > topCatAmount) {
        topCatAmount = val;
        topCategory = cat;
      }
    });

    let topChannel = 'Direct Sales';
    let topChanAmount = 0;
    Object.entries(channelTotals).forEach(([chan, val]) => {
      if (val > topChanAmount) {
        topChanAmount = val;
        topChannel = chan;
      }
    });

    intelEl.innerHTML = `<strong>Insight:</strong> <strong>${topCategory}</strong> leads revenue volume (${formatCurrency(topCatAmount)}). <strong>${topChannel}</strong> is the strongest channel. Projected to finish the cycle at <strong>${formatCurrency(projected)}</strong>.`;
  }

  // =========================================================================
  // Chart Visualizations (With Chart.js & Offline Native Canvas Fallback)
  // =========================================================================
  function renderAllCharts() {
    if (typeof Chart !== 'undefined') {
      renderRevenueTrendChart();
      renderCategoryDonutChart();
      renderChannelBarChart();
    } else {
      renderNativeCanvasFallbacks();
    }
  }

  function renderRevenueTrendChart() {
    const canvas = document.getElementById('revenueTrendChart');
    if (!canvas) return;

    const currentRecords = getFilteredRecords();
    const dateMap = {};

    currentRecords.forEach(item => {
      if (item.status === 'Completed') {
        if (!dateMap[item.date]) {
          dateMap[item.date] = { revenue: 0, profit: 0 };
        }
        dateMap[item.date].revenue += Number(item.amount);
        dateMap[item.date].profit += Number(item.amount) - Number(item.cost || 0);
      }
    });

    const sortedDates = Object.keys(dateMap).sort();
    const labels = sortedDates.map(d => {
      const parts = d.split('-');
      return `${parts[1]}/${parts[2]}`;
    });
    const revenueData = sortedDates.map(d => dateMap[d].revenue);
    const profitData = sortedDates.map(d => dateMap[d].profit);

    if (revenueTrendChartInstance) {
      revenueTrendChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    const revGradient = ctx.createLinearGradient(0, 0, 0, 260);
    revGradient.addColorStop(0, 'rgba(37, 99, 235, 0.22)');
    revGradient.addColorStop(1, 'rgba(37, 99, 235, 0.00)');

    const profitGradient = ctx.createLinearGradient(0, 0, 0, 260);
    profitGradient.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
    profitGradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');

    revenueTrendChartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['No Data'],
        datasets: [
          {
            label: 'Revenue',
            data: revenueData.length ? revenueData : [0],
            borderColor: '#2563eb',
            backgroundColor: revGradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#2563eb',
            pointRadius: 3.5,
            pointHoverRadius: 6
          },
          {
            label: 'Net Profit',
            data: profitData.length ? profitData : [0],
            borderColor: '#10b981',
            backgroundColor: profitGradient,
            borderWidth: 2.2,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#10b981',
            pointRadius: 3.5,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748b',
              font: { size: 11 }
            }
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: function (val) {
                return '$' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val);
              }
            }
          }
        }
      }
    });
  }

  function renderCategoryDonutChart() {
    const canvas = document.getElementById('categoryDonutChart');
    if (!canvas) return;

    const currentRecords = getFilteredRecords();
    const categories = ['Software', 'Hardware', 'Services', 'Consulting', 'Subscriptions'];
    const catAmounts = { Software: 0, Hardware: 0, Services: 0, Consulting: 0, Subscriptions: 0 };
    let totalCatRevenue = 0;

    currentRecords.filter(r => r.status === 'Completed').forEach(r => {
      if (catAmounts[r.category] !== undefined) {
        catAmounts[r.category] += Number(r.amount);
        totalCatRevenue += Number(r.amount);
      }
    });

    const dataValues = categories.map(c => catAmounts[c]);
    const bgColors = categories.map(c => COLOR_PALETTE[c]);

    if (categoryDonutChartInstance) {
      categoryDonutChartInstance.destroy();
    }

    categoryDonutChartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [
          {
            data: totalCatRevenue > 0 ? dataValues : [1],
            backgroundColor: totalCatRevenue > 0 ? bgColors : ['#e2e8f0'],
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            callbacks: {
              label: function (context) {
                if (totalCatRevenue === 0) return ' No transactions';
                const val = context.parsed;
                const pct = ((val / totalCatRevenue) * 100).toFixed(1);
                return ` ${context.label}: ${formatCurrency(val)} (${pct}%)`;
              }
            }
          }
        }
      }
    });

    renderCategoryBreakdownList(categories, catAmounts, totalCatRevenue);
  }

  function renderCategoryBreakdownList(categories, catAmounts, totalCatRevenue) {
    const breakdownList = document.getElementById('category-breakdown-list');
    if (!breakdownList) return;

    breakdownList.innerHTML = '';
    categories.forEach(cat => {
      const val = catAmounts[cat] || 0;
      const pct = totalCatRevenue > 0 ? ((val / totalCatRevenue) * 100).toFixed(1) : '0.0';

      const row = document.createElement('div');
      row.className = 'cat-breakdown-row';
      row.innerHTML = `
        <div class="cat-label-group">
          <span class="cat-dot" style="background-color: ${COLOR_PALETTE[cat]};"></span>
          <span>${cat}</span>
        </div>
        <div class="cat-val-group">
          <span class="cat-amount">${formatCurrency(val)}</span>
          <span class="cat-pct">${pct}%</span>
        </div>
      `;
      breakdownList.appendChild(row);
    });
  }

  function renderChannelBarChart() {
    const canvas = document.getElementById('channelBarChart');
    if (!canvas) return;

    const currentRecords = getFilteredRecords();
    const channels = ['Direct Sales', 'Online Store', 'Partner', 'Wholesale'];
    const channelTotals = { 'Direct Sales': 0, 'Online Store': 0, 'Partner': 0, 'Wholesale': 0 };

    currentRecords.filter(r => r.status === 'Completed').forEach(r => {
      if (channelTotals[r.channel] !== undefined) {
        channelTotals[r.channel] += Number(r.amount);
      }
    });

    const dataValues = channels.map(c => channelTotals[c]);
    const bgColors = channels.map(c => CHANNEL_COLORS[c]);

    if (channelBarChartInstance) {
      channelBarChartInstance.destroy();
    }

    channelBarChartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: channels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: bgColors,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 38
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            callbacks: {
              label: function (ctx) {
                return ` Volume: ${formatCurrency(ctx.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#475569',
              font: { size: 11, weight: '500' }
            }
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: function (val) {
                return '$' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val);
              }
            }
          }
        }
      }
    });
  }

  // =========================================================================
  // Native HTML5 Canvas Fallbacks (If Offline or CDN unavailable)
  // =========================================================================
  function renderNativeCanvasFallbacks() {
    const currentRecords = getFilteredRecords();

    // 1. Trend Line
    const trendCanvas = document.getElementById('revenueTrendChart');
    if (trendCanvas) {
      const dateMap = {};
      currentRecords.forEach(item => {
        if (item.status === 'Completed') {
          if (!dateMap[item.date]) dateMap[item.date] = { revenue: 0, profit: 0 };
          dateMap[item.date].revenue += Number(item.amount);
          dateMap[item.date].profit += Number(item.amount) - Number(item.cost || 0);
        }
      });
      const sortedDates = Object.keys(dateMap).sort();
      const revData = sortedDates.map(d => dateMap[d].revenue);
      const profitData = sortedDates.map(d => dateMap[d].profit);
      drawNativeLine(trendCanvas, sortedDates, revData, profitData);
    }

    // 2. Category Doughnut
    const donutCanvas = document.getElementById('categoryDonutChart');
    const categories = ['Software', 'Hardware', 'Services', 'Consulting', 'Subscriptions'];
    const catAmounts = { Software: 0, Hardware: 0, Services: 0, Consulting: 0, Subscriptions: 0 };
    let totalCatRevenue = 0;
    currentRecords.filter(r => r.status === 'Completed').forEach(r => {
      if (catAmounts[r.category] !== undefined) {
        catAmounts[r.category] += Number(r.amount);
        totalCatRevenue += Number(r.amount);
      }
    });
    if (donutCanvas) {
      drawNativeDonut(donutCanvas, categories, catAmounts, totalCatRevenue);
    }
    renderCategoryBreakdownList(categories, catAmounts, totalCatRevenue);

    // 3. Channel Bars
    const barCanvas = document.getElementById('channelBarChart');
    if (barCanvas) {
      const channels = ['Direct Sales', 'Online Store', 'Partner', 'Wholesale'];
      const chanAmounts = { 'Direct Sales': 0, 'Online Store': 0, 'Partner': 0, 'Wholesale': 0 };
      currentRecords.filter(r => r.status === 'Completed').forEach(r => {
        if (chanAmounts[r.channel] !== undefined) {
          chanAmounts[r.channel] += Number(r.amount);
        }
      });
      drawNativeBar(barCanvas, channels, chanAmounts);
    }
  }

  function drawNativeLine(canvas, dates, revData, profitData) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth || 600;
    const h = canvas.height = 280;
    ctx.clearRect(0, 0, w, h);

    if (revData.length === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No transaction data for this period', w / 2, h / 2);
      return;
    }

    const padding = { top: 20, right: 20, bottom: 35, left: 55 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const maxVal = Math.max(...revData, 1000) * 1.15;

    // Draw horizontal grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      const val = maxVal - (maxVal / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillText('$' + Math.round(val / 1000) + 'k', padding.left - 8, y + 4);
    }

    // Helper for coords
    const getX = i => padding.left + (chartW / (revData.length - 1 || 1)) * i;
    const getY = v => padding.top + chartH - (v / maxVal) * chartH;

    // Revenue line
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    revData.forEach((v, i) => {
      const x = getX(i);
      const y = getY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Profit line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    profitData.forEach((v, i) => {
      const x = getX(i);
      const y = getY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Data points & X labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    dates.forEach((d, i) => {
      const x = getX(i);
      const parts = d.split('-');
      ctx.fillText(`${parts[1]}/${parts[2]}`, x, h - 10);

      // Dot for revenue
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(x, getY(revData[i]), 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawNativeDonut(canvas, categories, catAmounts, total) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth || 280;
    const h = canvas.height = 200;
    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(centerX, centerY) - 14;
    const innerRadius = radius * 0.72;

    if (total === 0) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = radius - innerRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius + innerRadius) / 2, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    let startAngle = -Math.PI / 2;
    categories.forEach(cat => {
      const val = catAmounts[cat] || 0;
      if (val <= 0) return;
      const sliceAngle = (val / total) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = COLOR_PALETTE[cat];
      ctx.fill();

      startAngle = endAngle;
    });

    // Center total label
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$' + Math.round(total / 1000) + 'k', centerX, centerY);
  }

  function drawNativeBar(canvas, channels, chanAmounts) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth || 300;
    const h = canvas.height = 220;
    ctx.clearRect(0, 0, w, h);

    const vals = channels.map(c => chanAmounts[c] || 0);
    const maxVal = Math.max(...vals, 1000) * 1.2;
    const padding = { top: 20, right: 15, bottom: 35, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const barWidth = Math.min(36, chartW / channels.length - 16);

    // Draw grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 3; i++) {
      const y = padding.top + (chartH / 3) * i;
      const val = maxVal - (maxVal / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillText('$' + Math.round(val / 1000) + 'k', padding.left - 6, y + 4);
    }

    // Draw bars
    channels.forEach((chan, i) => {
      const val = chanAmounts[chan] || 0;
      const barH = (val / maxVal) * chartH;
      const x = padding.left + (chartW / channels.length) * i + (chartW / channels.length - barWidth) / 2;
      const y = padding.top + chartH - barH;

      ctx.fillStyle = CHANNEL_COLORS[chan];
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Label below bar
      ctx.fillStyle = '#475569';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      const shortName = chan.replace(' Sales', '').replace(' Store', '');
      ctx.fillText(shortName, x + barWidth / 2, h - 10);
    });
  }

  // =========================================================================
  // Data Table & Pagination
  // =========================================================================
  function renderTable() {
    const tableBody = document.getElementById('table-body');
    const emptyState = document.getElementById('table-empty-state');
    const totalCountEl = document.getElementById('table-total-count');
    const paginationFooter = document.getElementById('table-pagination');

    const queriedRecords = getTableQueriedRecords();
    const totalRecords = queriedRecords.length;

    totalCountEl.textContent = `Showing ${totalRecords} transaction${totalRecords === 1 ? '' : 's'}`;

    if (totalRecords === 0) {
      tableBody.innerHTML = '';
      emptyState.style.display = 'flex';
      paginationFooter.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    paginationFooter.style.display = 'flex';

    // Pagination slice
    const totalPages = Math.ceil(totalRecords / state.pagination.pageSize) || 1;
    if (state.pagination.currentPage > totalPages) {
      state.pagination.currentPage = totalPages;
    }

    const startIndex = (state.pagination.currentPage - 1) * state.pagination.pageSize;
    const pageRecords = queriedRecords.slice(startIndex, startIndex + state.pagination.pageSize);

    tableBody.innerHTML = pageRecords.map(item => {
      const profit = Number(item.amount) - Number(item.cost || 0);
      const badgeClass = item.status === 'Completed'
        ? 'badge-completed'
        : (item.status === 'Pending' ? 'badge-pending' : 'badge-refunded');

      return `
        <tr>
          <td><span class="cell-order-id">${escapeHtml(item.id)}</span></td>
          <td>${formatDateDisplay(item.date)}</td>
          <td>
            <div class="cell-customer">
              <span class="cust-name">${escapeHtml(item.customer)}</span>
              <span class="cust-email">${escapeHtml(item.email)}</span>
            </div>
          </td>
          <td>${escapeHtml(item.product)}</td>
          <td><span class="cell-category">${escapeHtml(item.category)}</span></td>
          <td>${escapeHtml(item.channel)}</td>
          <td class="text-right cell-amount">${formatCurrency(item.amount)}</td>
          <td class="text-right cell-profit">${formatCurrency(profit)}</td>
          <td class="text-center">
            <span class="badge-status ${badgeClass}">
              ${escapeHtml(item.status)}
            </span>
          </td>
          <td class="text-center">
            <div class="table-actions">
              <button class="btn-icon btn-edit-sale" data-id="${item.id}" title="Edit Record">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-icon delete btn-delete-sale" data-id="${item.id}" title="Delete Record">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    renderPaginationControls(totalRecords, totalPages);
    attachRowEventListeners();
  }

  function renderPaginationControls(totalRecords, totalPages) {
    const pageInfo = document.getElementById('pagination-info-text');
    const prevBtn = document.getElementById('btn-prev-page');
    const nextBtn = document.getElementById('btn-next-page');
    const numbersContainer = document.getElementById('pagination-numbers');

    const startItem = (state.pagination.currentPage - 1) * state.pagination.pageSize + 1;
    const endItem = Math.min(state.pagination.currentPage * state.pagination.pageSize, totalRecords);

    pageInfo.textContent = `Showing ${startItem}–${endItem} of ${totalRecords}`;

    prevBtn.disabled = state.pagination.currentPage <= 1;
    nextBtn.disabled = state.pagination.currentPage >= totalPages;

    numbersContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 7) {
        if (i !== 1 && i !== totalPages && Math.abs(i - state.pagination.currentPage) > 1) {
          continue;
        }
      }
      const pageNumBtn = document.createElement('button');
      pageNumBtn.className = `page-num ${i === state.pagination.currentPage ? 'active' : ''}`;
      pageNumBtn.textContent = i;
      pageNumBtn.addEventListener('click', () => {
        state.pagination.currentPage = i;
        renderTable();
      });
      numbersContainer.appendChild(pageNumBtn);
    }
  }

  function attachRowEventListeners() {
    // Edit buttons
    document.querySelectorAll('.btn-edit-sale').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.getAttribute('data-id');
        openEditModal(id);
      });
    });

    // Delete buttons
    document.querySelectorAll('.btn-delete-sale').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.getAttribute('data-id');
        openDeleteModal(id);
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // Master Render Cycle
  // =========================================================================
  function renderAll() {
    updateKPIs();
    renderAllCharts();
    renderTable();
    updateSystemStatus();
  }

  function updateSystemStatus() {
    const statusTextEl = document.getElementById('live-time-display');
    if (statusTextEl) {
      statusTextEl.textContent = `Live Storage Sync \u2022 ${state.records.length} records`;
    }
  }

  // =========================================================================
  // Modal & Form Handlers (Add / Edit Sale)
  // =========================================================================
  const modalOverlay = document.getElementById('transaction-modal');
  const modalHeading = document.getElementById('modal-heading');
  const transactionForm = document.getElementById('transaction-form');
  const saleIdInput = document.getElementById('sale-id');
  const customerInput = document.getElementById('form-customer');
  const emailInput = document.getElementById('form-email');
  const productInput = document.getElementById('form-product');
  const categorySelect = document.getElementById('form-category');
  const channelSelect = document.getElementById('form-channel');
  const amountInput = document.getElementById('form-amount');
  const costInput = document.getElementById('form-cost');
  const dateInput = document.getElementById('form-date');
  const statusSelect = document.getElementById('form-status');

  function openAddModal() {
    modalHeading.textContent = 'Record New Sale';
    saleIdInput.value = '';
    transactionForm.reset();
    clearFormErrors();

    // Default date to today's reference date
    dateInput.value = '2026-11-09';
    categorySelect.value = 'Software';
    channelSelect.value = 'Direct Sales';
    statusSelect.value = 'Completed';

    modalOverlay.style.display = 'flex';
    customerInput.focus();
  }

  function openEditModal(id) {
    const item = state.records.find(r => r.id === id);
    if (!item) return;

    modalHeading.textContent = `Edit Sale (${item.id})`;
    saleIdInput.value = item.id;
    customerInput.value = item.customer;
    emailInput.value = item.email;
    productInput.value = item.product;
    categorySelect.value = item.category;
    channelSelect.value = item.channel;
    amountInput.value = item.amount;
    costInput.value = item.cost;
    dateInput.value = item.date;
    statusSelect.value = item.status;

    clearFormErrors();
    modalOverlay.style.display = 'flex';
    customerInput.focus();
  }

  function closeModal() {
    modalOverlay.style.display = 'none';
  }

  function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  }

  function validateForm() {
    let isValid = true;
    clearFormErrors();

    if (!customerInput.value.trim()) {
      document.getElementById('err-customer').textContent = 'Customer name is required';
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
      document.getElementById('err-email').textContent = 'Valid email is required';
      isValid = false;
    }

    if (!productInput.value.trim()) {
      document.getElementById('err-product').textContent = 'Product name is required';
      isValid = false;
    }

    const amountVal = parseFloat(amountInput.value);
    if (isNaN(amountVal) || amountVal < 0) {
      document.getElementById('err-amount').textContent = 'Enter a valid positive revenue amount';
      isValid = false;
    }

    const costVal = parseFloat(costInput.value);
    if (isNaN(costVal) || costVal < 0) {
      document.getElementById('err-cost').textContent = 'Enter a valid positive cost basis';
      isValid = false;
    }

    if (!dateInput.value) {
      document.getElementById('err-date').textContent = 'Date is required';
      isValid = false;
    }

    return isValid;
  }

  transactionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const existingId = saleIdInput.value;
    const amountVal = parseFloat(amountInput.value);
    const costVal = parseFloat(costInput.value);

    if (existingId) {
      // Update record
      const index = state.records.findIndex(r => r.id === existingId);
      if (index !== -1) {
        state.records[index] = {
          ...state.records[index],
          customer: customerInput.value.trim(),
          email: emailInput.value.trim(),
          product: productInput.value.trim(),
          category: categorySelect.value,
          channel: channelSelect.value,
          amount: amountVal,
          cost: costVal,
          date: dateInput.value,
          status: statusSelect.value
        };
        saveRecordsToStorage(state.records);
        showToast(`Transaction ${existingId} updated successfully`);
      }
    } else {
      // Create new record
      const newId = 'TX-' + Math.floor(1000 + Math.random() * 9000);
      const newRecord = {
        id: newId,
        customer: customerInput.value.trim(),
        email: emailInput.value.trim(),
        product: productInput.value.trim(),
        category: categorySelect.value,
        channel: channelSelect.value,
        amount: amountVal,
        cost: costVal,
        date: dateInput.value,
        status: statusSelect.value
      };
      state.records.unshift(newRecord);
      saveRecordsToStorage(state.records);
      showToast(`Sale ${newId} recorded successfully`);
    }

    closeModal();
    renderAll();
  });

  // =========================================================================
  // Delete Transaction Modal Handlers
  // =========================================================================
  const deleteModal = document.getElementById('delete-modal');
  const deleteOrderIdSpan = document.getElementById('delete-order-id');

  function openDeleteModal(id) {
    state.pendingDeleteId = id;
    deleteOrderIdSpan.textContent = id;
    deleteModal.style.display = 'flex';
  }

  function closeDeleteModal() {
    deleteModal.style.display = 'none';
    state.pendingDeleteId = null;
  }

  document.getElementById('btn-confirm-delete').addEventListener('click', () => {
    if (state.pendingDeleteId) {
      const idToDelete = state.pendingDeleteId;
      state.records = state.records.filter(r => r.id !== idToDelete);
      saveRecordsToStorage(state.records);
      showToast(`Transaction ${idToDelete} deleted`);
      closeDeleteModal();
      renderAll();
    }
  });

  document.getElementById('btn-cancel-delete').addEventListener('click', closeDeleteModal);
  document.getElementById('btn-close-delete-modal').addEventListener('click', closeDeleteModal);

  // =========================================================================
  // CSV Export Functionality
  // =========================================================================
  function exportFilteredCSV() {
    const dataToExport = getFilteredRecords();
    if (dataToExport.length === 0) {
      showToast('No records available to export', 'danger');
      return;
    }

    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Product', 'Category', 'Channel', 'Revenue', 'Cost', 'Profit', 'Status'];
    const rows = dataToExport.map(r => {
      const profit = (Number(r.amount) - Number(r.cost || 0)).toFixed(2);
      return [
        r.id,
        r.date,
        `"${(r.customer || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.product || '').replace(/"/g, '""')}"`,
        r.category,
        r.channel,
        r.amount.toFixed(2),
        (r.cost || 0).toFixed(2),
        profit,
        r.status
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_analytics_${state.filters.period}_2026-11-09.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${dataToExport.length} transactions to CSV`);
  }

  // =========================================================================
  // Global Event Listeners & Controls
  // =========================================================================
  function setupEventListeners() {
    // Toolbar Filters
    const dateRangeFilter = document.getElementById('filter-date-range');
    dateRangeFilter.addEventListener('change', e => {
      state.filters.period = e.target.value;
      state.pagination.currentPage = 1;
      renderAll();
    });

    const categoryFilter = document.getElementById('filter-category');
    categoryFilter.addEventListener('change', e => {
      state.filters.category = e.target.value;
      state.pagination.currentPage = 1;
      renderAll();
    });

    const channelFilter = document.getElementById('filter-channel');
    channelFilter.addEventListener('change', e => {
      state.filters.channel = e.target.value;
      state.pagination.currentPage = 1;
      renderAll();
    });

    // Table Filters
    const tableStatusFilter = document.getElementById('table-status-filter');
    tableStatusFilter.addEventListener('change', e => {
      state.filters.status = e.target.value;
      state.pagination.currentPage = 1;
      renderTable();
    });

    const tableSortFilter = document.getElementById('table-sort-filter');
    tableSortFilter.addEventListener('change', e => {
      state.filters.sort = e.target.value;
      renderTable();
    });

    // Search Input
    const searchInput = document.getElementById('table-search');
    const searchClearBtn = document.getElementById('search-clear-btn');

    searchInput.addEventListener('input', e => {
      state.filters.search = e.target.value;
      searchClearBtn.style.display = e.target.value ? 'block' : 'none';
      state.pagination.currentPage = 1;
      renderTable();
    });

    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.filters.search = '';
      searchClearBtn.style.display = 'none';
      state.pagination.currentPage = 1;
      renderTable();
      searchInput.focus();
    });

    // Clear filters from empty state
    document.getElementById('btn-empty-clear').addEventListener('click', () => {
      searchInput.value = '';
      state.filters.search = '';
      searchClearBtn.style.display = 'none';
      tableStatusFilter.value = 'all';
      state.filters.status = 'all';
      categoryFilter.value = 'all';
      state.filters.category = 'all';
      channelFilter.value = 'all';
      state.filters.channel = 'all';
      dateRangeFilter.value = 'all';
      state.filters.period = 'all';
      state.pagination.currentPage = 1;
      renderAll();
    });

    // Pagination buttons
    document.getElementById('btn-prev-page').addEventListener('click', () => {
      if (state.pagination.currentPage > 1) {
        state.pagination.currentPage--;
        renderTable();
      }
    });

    document.getElementById('btn-next-page').addEventListener('click', () => {
      const totalPages = Math.ceil(getTableQueriedRecords().length / state.pagination.pageSize);
      if (state.pagination.currentPage < totalPages) {
        state.pagination.currentPage++;
        renderTable();
      }
    });

    // Action Buttons
    document.getElementById('btn-open-add-modal').addEventListener('click', openAddModal);
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);

    document.getElementById('btn-export-csv').addEventListener('click', exportFilteredCSV);

    document.getElementById('btn-reset-data').addEventListener('click', () => {
      if (confirm('Reset dashboard to default demo transactions? Any custom additions will be replaced.')) {
        const freshSeed = getSampleSeedData();
        state.records = freshSeed;
        saveRecordsToStorage(freshSeed);
        showToast('Dashboard restored to default dataset');
        renderAll();
      }
    });

    // Close modals on clicking overlay background
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal();
    });

    deleteModal.addEventListener('click', e => {
      if (e.target === deleteModal) closeDeleteModal();
    });

    // Escape key closes modals
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
      }
    });

    // Resize event to redraw native canvas if needed
    window.addEventListener('resize', () => {
      if (typeof Chart === 'undefined') {
        renderNativeCanvasFallbacks();
      }
    });
  }

  // =========================================================================
  // Dashboard Initialization
  // =========================================================================
  function initDashboard() {
    state.records = loadRecordsFromStorage();
    setupEventListeners();
    renderAll();
  }

  // Kickstart when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }

})();
