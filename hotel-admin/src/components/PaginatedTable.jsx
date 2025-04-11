import React, { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';

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

  return (
    <>
      <Table bordered hover responsive>
        <thead>
        <tr>
            {columns.map((col) => (
              <th key={col}>{col.charAt(0).toUpperCase() + col.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {currentRows.map((item, idx) => (
            <tr key={indexOfFirstRow + idx}>
              {columns.map((col) => (
                <td key={col}>{item[col]}</td>
              ))}
              {rowActions.length > 0 && (
                <td className="d-flex gap-2">
                  {rowActions.map((action, i) => (
                    <span
                      key={i}
                      role="button"
                      title={action.label}
                      onClick={() => action.onClick(item)}
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
