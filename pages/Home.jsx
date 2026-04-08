import { useState, useEffect, useCallback } from "react";
import { api } from "../services/quantityService";
import { MEASUREMENT_TYPES, OPERATIONS, getUnitLabel } from "../services/units";
import "./Home.css";

const DEFAULT_TYPE = "LengthUnit";
const DEFAULT_UNITS = MEASUREMENT_TYPES[DEFAULT_TYPE].units;

export default function Home() {
  const [measureType, setMeasureType] = useState(DEFAULT_TYPE);
  const [operation,   setOperation]   = useState("convert");

  const [val1,  setVal1]  = useState("1");
  const [unit1, setUnit1] = useState(DEFAULT_UNITS[0]);
  const [val2,  setVal2]  = useState("0");
  const [unit2, setUnit2] = useState(DEFAULT_UNITS[1]);

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const [history,     setHistory]     = useState([]);
  const [historyTab,  setHistoryTab]  = useState("CONVERT");
  const [historyLoading, setHistoryLoading] = useState(false);

  const units = MEASUREMENT_TYPES[measureType].units;

  // When measureType changes, reset units to first two of that type
useEffect(() => {
  const u = MEASUREMENT_TYPES[measureType].units;

  setUnit1(u[0]);
  setUnit2(u[1] || u[0]);

  // ✅ Reset secondary value to avoid stale invalid requests
  setVal2("0");

  setResult(null);
  setError(null);
}, [measureType]);

  // Auto-compute on any input change for convert
  useEffect(() => {
    if (operation === "convert" && val1 && !isNaN(parseFloat(val1))) {
      compute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val1, unit1, unit2, measureType, operation]);

  const compute = useCallback(async () => {
  if (!val1 || isNaN(parseFloat(val1))) return;

  // ✅ CRITICAL GUARD (THIS WAS MISSING)
  const validUnits = MEASUREMENT_TYPES[measureType].units;
  if (!validUnits.includes(unit1)) return;
  if (operation !== "convert" && !validUnits.includes(unit2)) return;

  if (operation !== "convert" && (!val2 || isNaN(parseFloat(val2)))) return;

  setLoading(true);
  setError(null);

  try {
    const body = {
      thisQuantityDTO: {
        value: parseFloat(val1),
        unit: unit1,
        measurementType: measureType,
      },
      thatQuantityDTO: {
        value: parseFloat(val2),
        unit: unit2,
        measurementType: measureType,
      },
    };

    let data;

    switch (operation) {
      case "convert":
        data = await api.convert({
          thisQuantityDTO: {
            value: parseFloat(val1),
            unit: unit1,
            measurementType: measureType,
          },
          thatQuantityDTO: {
            value: 0,
            unit: unit2,
            measurementType: measureType,
          },
        });
        break;

      case "compare":
        data = await api.compare(body);
        break;

      case "add":
        data = await api.add(body);
        break;

      case "subtract":
        data = await api.subtract(body);
        break;

      case "divide":
        data = await api.divide(body);
        break;

      default:
        return;
    }

    setResult(data);
  } catch (e) {
    setError(e.message);
    setResult(null);
  } finally {
    setLoading(false);
  }
}, [val1, val2, unit1, unit2, measureType, operation]);

  const fetchHistory = async (tab) => {
    setHistoryTab(tab);
    setHistoryLoading(true);
    try {
      const data = await api.history(tab);
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const renderResult = () => {
    if (loading) return <div className="result-box loading"><span className="spinner" />Computing…</div>;
    if (error)   return <div className="result-box error">⚠ {error}</div>;
    if (!result) return null;

    if (result.error) return <div className="result-box error">⚠ {result.errorMessage}</div>;

    if (operation === "compare") {
      const eq = result.resultString === "true";
      return (
        <div className={`result-box ${eq ? "equal" : "notequal"}`}>
          <span className="result-icon">{eq ? "✓" : "✗"}</span>
          <span className="result-text">
            {result.thisValue} {getUnitLabel(measureType, result.thisUnit)} is
            <strong>{eq ? " equal to " : " NOT equal to "}</strong>
            {result.thatValue} {getUnitLabel(measureType, result.thatUnit)}
          </span>
        </div>
      );
    }

    return (
      <div className="result-box success">
        <div className="result-main">
          <span className="result-number">{Number(result.resultValue.toFixed(6))}</span>
          <span className="result-unit">{getUnitLabel(measureType, result.resultUnit)}</span>
        </div>
        <div className="result-sub">
          {result.thisValue} {getUnitLabel(measureType, result.thisUnit)}
          <span className="op-label"> {OPERATIONS.find(o => o.id === operation)?.icon} </span>
          {operation !== "convert" && <>{result.thatValue} {getUnitLabel(measureType, result.thatUnit)}</>}
          {operation === "convert" && <>{getUnitLabel(measureType, result.thatUnit)}</>}
        </div>
      </div>
    );
  };

  const showSecondInput = operation !== "convert";

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">QMEASURE</h1>
          <p className="tagline">Unit Conversion & Arithmetic</p>
        </div>
      </header>

      <main className="main">
        <div className="card calc-card">

          {/* Measurement type selector */}
          <div className="type-tabs">
            {Object.entries(MEASUREMENT_TYPES).map(([key, cfg]) => (
              <button
                key={key}
                className={`type-tab ${measureType === key ? "active" : ""}`}
                onClick={() => setMeasureType(key)}
              >
                <span className="type-icon">{cfg.icon}</span>
                <span className="type-label">{cfg.label}</span>
              </button>
            ))}
          </div>

          {/* Operation selector */}
          <div className="op-tabs">
            {OPERATIONS.map(op => (
              <button
                key={op.id}
                className={`op-tab ${operation === op.id ? "active" : ""}`}
                onClick={() => { setOperation(op.id); setResult(null); }}
              >
                <span className="op-icon">{op.icon}</span> {op.label}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="inputs-grid">
            {/* Input 1 */}
            <div className="input-group">
              <label className="input-label">Value</label>
              <div className="input-row">
                <input
                  className="num-input"
                  type="number"
                  value={val1}
                  onChange={e => setVal1(e.target.value)}
                  placeholder="0"
                />
                <select
                  className="unit-select"
                  value={unit1}
                  onChange={e => setUnit1(e.target.value)}
                >
                  {units.map(u => (
                    <option key={u} value={u}>{getUnitLabel(measureType, u)} ({u})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Operator badge */}
            <div className="operator-badge">
              {operation === "convert"
                ? <span className="op-arrow">→</span>
                : <span className="op-sym">{OPERATIONS.find(o => o.id === operation)?.icon}</span>
              }
            </div>

            {/* Input 2 */}
            <div className="input-group">
              <label className="input-label">{operation === "convert" ? "Target Unit" : "Value"}</label>
              <div className="input-row">
                {showSecondInput && (
                  <input
                    className="num-input"
                    type="number"
                    value={val2}
                    onChange={e => setVal2(e.target.value)}
                    placeholder="0"
                  />
                )}
                <select
                  className="unit-select"
                  value={unit2}
                  onChange={e => setUnit2(e.target.value)}
                >
                  {units.map(u => (
                    <option key={u} value={u}>{getUnitLabel(measureType, u)} ({u})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Compute button (auto for convert) */}
          {operation !== "convert" && (
            <button className="compute-btn" onClick={compute} disabled={loading}>
              {loading ? "Computing…" : `Calculate ${OPERATIONS.find(o => o.id === operation)?.label}`}
            </button>
          )}

          {/* Result */}
          {renderResult()}
        </div>

        {/* History Panel */}
        <div className="card history-card">
          <h2 className="section-title">History</h2>
          <div className="history-tabs">
            {["CONVERT", "COMPARE", "ADD", "SUBTRACT", "DIVIDE"].map(op => (
              <button
                key={op}
                className={`htab ${historyTab === op ? "active" : ""}`}
                onClick={() => fetchHistory(op)}
              >
                {op}
              </button>
            ))}
          </div>

          {historyLoading ? (
            <div className="history-loading"><span className="spinner" /></div>
          ) : history.length === 0 ? (
            <div className="history-empty">No records yet. Run some calculations!</div>
          ) : (
            <div className="history-list">
              {history.slice().reverse().map((item, i) => (
                <div key={i} className={`history-item ${item.error ? "h-error" : "h-ok"}`}>
                  <span className="h-op">{item.operation}</span>
                  <span className="h-detail">
                    {item.thisValue} {item.thisUnit}
                    {item.operation !== "CONVERT" && ` ${OPERATIONS.find(o => o.id === item.operation?.toLowerCase())?.icon || "?"} ${item.thatValue} ${item.thatUnit}`}
                  </span>
                  <span className="h-result">
                    {item.error
                      ? <span className="h-err-msg">Error</span>
                      : item.operation === "COMPARE"
                        ? <span className={item.resultString === "true" ? "h-true" : "h-false"}>{item.resultString === "true" ? "Equal" : "Not Equal"}</span>
                        : <>{Number(item.resultValue.toFixed(4))} {item.resultUnit}</>
                    }
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
