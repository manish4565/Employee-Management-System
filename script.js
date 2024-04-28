document.addEventListener("DOMContentLoaded", function() {
    function fetchEmployees(url) {
      return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Error fetching employees:', error));
    }
    function renderEmployees(data) {
      const tableBody = document.getElementById('employeeData');
      tableBody.innerHTML = '';
  
      data.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${employee.name}</td>
          <td>${employee.gender}</td>
          <td>${employee.department}</td>
          <td>${employee.salary}</td>
        `;
        tableBody.appendChild(row);
      });
    }
    let currentPage = 1;
    let totalPages = 1;
  
    function updatePagination() {
      document.getElementById('pageInfo').textContent = `Page ${currentPage}`;
      document.getElementById('prevBtn').disabled = currentPage === 1;
      document.getElementById('nextBtn').disabled = currentPage === totalPages;
    }
  
    function paginate(data, page, limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      totalPages = Math.ceil(data.length / limit);
      return data.slice(startIndex, endIndex);
    }
  
    document.getElementById('prevBtn').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updatePagination();
        renderEmployees(paginate(filteredData, currentPage, limit));
      }
    });
  
    document.getElementById('nextBtn').addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
        renderEmployees(paginate(filteredData, currentPage, limit));
      }
    });
  
    document.getElementById('departmentFilter').addEventListener('change', handleFilterChange);
    document.getElementById('genderFilter').addEventListener('change', handleFilterChange);
    document.getElementById('sortOrder').addEventListener('change', handleSortChange);
  
    const limit = 10;
    let filteredData = [];
  
    fetchEmployees(`https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees`)
      .then(data => {
        filteredData = data;
        renderEmployees(paginate(filteredData, currentPage, limit));
        updatePagination();
      })
      .catch(error => console.error('Error initializing:', error));
  
    function handleFilterChange() {
      const departmentFilter = document.getElementById('departmentFilter').value;
      const genderFilter = document.getElementById('genderFilter').value;
  
      filteredData = data.filter(employee => {
        if (departmentFilter && departmentFilter !== 'all' && employee.department !== departmentFilter) {
          return false;
        }
        if (genderFilter && genderFilter !== 'all' && employee.gender !== genderFilter) {
          return false;
        }
        return true;
      });
  
      renderEmployees(paginate(filteredData, currentPage, limit));
      updatePagination();
    }
  
    function handleSortChange() {
      const sortOrder = document.getElementById('sortOrder').value;
  
      filteredData.sort((a, b) => {
        const salaryA = parseFloat(a.salary);
        const salaryB = parseFloat(b.salary);
        if (sortOrder === 'asc') {
          return salaryA - salaryB;
        } else if (sortOrder === 'desc') {
          return salaryB - salaryA;
        }
      });
  
      renderEmployees(paginate(filteredData, currentPage, limit));
      updatePagination();
    }
  });
  