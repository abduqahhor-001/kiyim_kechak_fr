"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AlertTriangle,
  Calendar,
  ChevronDown,
} from "lucide-react"
import { saleAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import Chart from "../components/Chart"
import toast from "react-hot-toast"

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState("monthly")
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)

  const timePeriods = [
    { value: "weekly", label: "Haftalik" },
    { value: "monthly", label: "Oylik" },
    { value: "yearly", label: "Yillik" },
  ]

  useEffect(() => {
    loadDashboardData()
  }, []) // Faqat component mount bo'lganda

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await saleAPI.getStatistics()
      setStats(response.data)
    } catch (error) {
      toast.error("Dashboard ma'lumotlarini yuklashda xatolik")
      console.error("Dashboard error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm"
  }

  const calculateProfitMargin = (revenue, profit) => {
    if (revenue === 0) return 0
    return ((profit / revenue) * 100).toFixed(1)
  }

  const mainStats = [
    {
      title: "Bugungi daromad",
      value: formatCurrency(stats?.today?.revenue || 0),
      icon: DollarSign,
      color: "bg-blue-500",
      change: "+12.5%",
      changeType: "positive",
    },
    {
      title: "Bugungi foyda",
      value: formatCurrency(stats?.today?.profit || 0),
      icon: TrendingUp,
      color: "bg-green-500",
      change: "+8.2%",
      changeType: "positive",
    },
    {
      title: "Bugungi sotuvlar",
      value: stats?.today?.sales_count || 0,
      icon: ShoppingCart,
      color: "bg-purple-500",
      change: "+5.1%",
      changeType: "positive",
    },
    {
      title: "Foyda foizi",
      value: calculateProfitMargin(stats?.today?.revenue || 0, stats?.today?.profit || 0) + "%",
      icon: TrendingDown,
      color: "bg-orange-500",
      change: "-2.1%",
      changeType: "negative",
    },
  ]

  const businessStats = [
    {
      title: "Jami mijozlar",
      value: stats?.totals?.customers || 0,
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      title: "Jami mahsulotlar",
      value: stats?.totals?.products || 0,
      icon: Package,
      color: "bg-pink-500",
    },
    {
      title: "Kam qolgan mahsulotlar",
      value: stats?.low_stock_products || 0,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      title: "Yetkazib beruvchilar",
      value: stats?.totals?.suppliers || 0,
      icon: TrendingUp,
      color: "bg-teal-500",
    },
  ]

  const getCurrentPeriodData = () => {
    switch (timePeriod) {
      case "weekly":
        return stats?.charts?.weekly || []
      case "yearly":
        return stats?.charts?.yearly || []
      default:
        return stats?.charts?.monthly || []
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Biznes ko'rsatkichlari va statistika</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="stats-grid">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="stat-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-card-content">
                <div className={`stat-icon ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="stat-details">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-title">{stat.title}</p>
                  <div className={`stat-change ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Business Stats */}
      <div className="stats-grid">
        {businessStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="stat-card slide-up" style={{ animationDelay: `${(index + 4) * 0.1}s` }}>
              <div className="stat-card-content">
                <div className={`stat-icon ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="stat-details">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-title">{stat.title}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Period Stats */}
      <div className="period-stats">
        <div className="period-card">
          <h2 className="period-title">Haftalik statistika</h2>
          <div className="period-amount">{formatCurrency(stats?.week?.revenue || 0)}</div>
          <p className="period-sales">{stats?.week?.sales_count || 0} ta sotuv</p>
          <div className="period-profit">Foyda: {formatCurrency(stats?.week?.profit || 0)}</div>
          <div className="period-margin">
            Foyda foizi: {calculateProfitMargin(stats?.week?.revenue || 0, stats?.week?.profit || 0)}%
          </div>
        </div>

        <div className="period-card">
          <h2 className="period-title">Oylik statistika</h2>
          <div className="period-amount">{formatCurrency(stats?.month?.revenue || 0)}</div>
          <p className="period-sales">{stats?.month?.sales_count || 0} ta sotuv</p>
          <div className="period-profit">Foyda: {formatCurrency(stats?.month?.profit || 0)}</div>
          <div className="period-margin">
            Foyda foizi: {calculateProfitMargin(stats?.month?.revenue || 0, stats?.month?.profit || 0)}%
          </div>
        </div>

        <div className="period-card">
          <h2 className="period-title">Yillik statistika</h2>
          <div className="period-amount">{formatCurrency(stats?.year?.revenue || 0)}</div>
          <p className="period-sales">{stats?.year?.sales_count || 0} ta sotuv</p>
          <div className="period-profit">Foyda: {formatCurrency(stats?.year?.profit || 0)}</div>
          <div className="period-margin">
            Foyda foizi: {calculateProfitMargin(stats?.year?.revenue || 0, stats?.year?.profit || 0)}%
          </div>
        </div>
      </div>

      {/* Charts with Time Period Selector */}
      <div className="charts-section">
        <div className="charts-header">
          <h2 className="charts-title">Sotuvlar tahlili</h2>
          <div className="time-period-selector">
            <button className="period-dropdown-btn" onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}>
              <Calendar size={16} />
              {timePeriods.find((p) => p.value === timePeriod)?.label}
              <ChevronDown size={16} />
            </button>
            {showPeriodDropdown && (
              <div className="period-dropdown">
                {timePeriods.map((period) => (
                  <button
                    key={period.value}
                    className={`period-option ${timePeriod === period.value ? "active" : ""}`}
                    onClick={() => {
                      setTimePeriod(period.value)
                      setShowPeriodDropdown(false)
                    }}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="charts-grid">
          <Chart
            data={getCurrentPeriodData()}
            title={`${timePeriods.find((p) => p.value === timePeriod)?.label} sotuvlar`}
            type="revenue"
          />
          <Chart
            data={getCurrentPeriodData()}
            title={`${timePeriods.find((p) => p.value === timePeriod)?.label} foyda`}
            type="profit"
          />
        </div>
      </div>

      {/* Top Products */}
      <div className="top-products">
        <h2 className="top-products-title">Eng ko'p sotilgan mahsulotlar</h2>
        {stats?.top_products && stats.top_products.length > 0 ? (
          <div>
            {stats.top_products.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-info">
                  <div className="product-rank">{index + 1}</div>
                  <div className="product-details">
                    <h4>{product.product__name}</h4>
                    <p>Sotilgan: {product.total_sold} ta</p>
                  </div>
                </div>
                <div className="product-stats">
                  <div className="product-revenue">{formatCurrency(product.total_revenue)}</div>
                  <div className="product-profit">Foyda: {formatCurrency(product.total_profit || 0)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-lg">Hozircha sotuvlar ma'lumoti yo'q</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
