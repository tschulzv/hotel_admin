import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import DatePicker from './DatePicker';

// Barra que contiene barra de búsqueda, criterios de ordenacion y botón 'crear' para tablas
const TableFilterBar = ({searchTerm, setSearchTerm, onSearch, clearSearch, sortOptions, sortKey, setSort, showBtn, btnText, onBtnClick, sortOrder, setSortOrder, setStartDate, setEndDate, startDate, endDate, setFechaModificada, showDateSelect = true}) => {
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDateChange = ({ selection }) => {
    const newStart = selection.startDate;
    const newEnd = selection.endDate;

    // Si cambió el check-in, resetear el check-out
    if (!selection.startDate || newStart.getTime() !== startDate.getTime()) {
        setStartDate(newStart);
        if (newEnd && newEnd.getTime() !== newStart.getTime()) {
            setEndDate(newEnd);
        } else {
            setEndDate(null);
        }
        
    } else {
        setEndDate(newEnd);
    }
    setFechaModificada(true)
  };


  return (
    <Row className='align-items-center mb-2'>
        {/*primera columna: search bar*/ }
        <Col md={3} className="d-flex align-items-center gap-2">
            <input type="text" className="form-control"
            placeholder="Buscar..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-primary" onClick={onSearch}>
              <i className="material-icons align-middle">search</i>
            </Button>
        </Col>
        {/*segunda columna: filtro de ordenacion*/}
        <Col md={3} className="d-flex align-items-center justify-content-evenly">
         <span
          className="material-icons"
          style={{ cursor: 'pointer' }}
          onClick={toggleSortOrder}
          title={`Orden actual: ${sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}`}
        >
          {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
        </span>
          <select
            className="form-select"
            value={sortKey}
            onChange={(e) => setSort(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Col>
        {/*tercera columna: datepicker*/}
        {
          showDateSelect &&
          <Col md={3} >
              <span className="material-icons">date_range</span>
              <DatePicker ranges={[{ startDate: startDate, endDate: endDate, key: 'selection' }]}
              onChange={handleDateChange} />
          </Col>
        }
        {/* ultima columna: boton */}
        {
          showBtn &&
          <Col md={3} className="d-flex align-items-center justify-content-evenly">
             <Button label="Limpiar filtros" variant="outline-secondary" onClick={clearSearch}><span className="material-icons align-middle">filter_alt_off</span>
            </Button>
            <Button variant="primary" onClick={onBtnClick} className="d-flex align-items-center gap-2"><span className="material-icons">add_circle</span>{btnText}</Button>
          </Col>
        }

    </Row>
  )
}

export default TableFilterBar