import React, { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';

/*
DATA: recibe un array con objetos 

ROW ACTIONS: recibe un array de acciones con este formato
{
    icon: visibility, // NOMBRE DE ICONO DE GOOGLE MATERIAL ICONS
    label: "Ver",
    onClick: (rowData) => alert("ver datos"), // acción a ejecutar
},

ROWS PER PAGE: recibe la cantidad de filas que se quiere mostrar por página, por defecto 10

*/

function PaginatedTable({ data, rowActions, rowsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

    // obtener columnas automáticamente desde la primera fila
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // convierte nombres de columnas ej camelCase -> Camel Case
  const convertCamelCase = (text) => {
    const withSpaces = text.replace(/([A-Z])/g, ' $1');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }

  return (
    <>
      <Table bordered hover responsive>
        <thead>
        <tr>
            {columns.map((col) => (
              <th key={col}>{convertCamelCase(col)}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {currentRows.map((item, idx) => (
            <tr key={indexOfFirstRow + idx}>
              {columns.map((col) => (
                <td key={col}>{item[col]}</td>
              ))}
              {rowActions.length > 0 && (
                <td className="d-flex gap-2 justify-content-center">
                  {rowActions.map((action, i) => (
                    <span
                      key={i}
                      role="button"
                      title={action.label}
                      onClick={() => action.onClick(item, i)}
                      style={{ cursor: 'pointer', color: '#808080' }}
                    >
                      {typeof action.icon === 'string' ? (
                        <span className="material-icons">{action.icon}</span>
                      ) : (
                        action.icon
                      )}
                    </span>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </>
  );
}

export default PaginatedTable;
