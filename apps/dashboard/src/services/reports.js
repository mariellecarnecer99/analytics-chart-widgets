import http from "./base.js";

export function getAllReports() {
    return http.get("/reports");
}

export function getReport(id) {
    return http.get(`/reports/${id}`);
}

export function addReport(data) {
    return http.post("/reports", data);
}

export function updateReport(id, data) {
    return http.put(`/reports/${id}`, data);
}

export function deleteReport(id) {
    return http.delete(`/reports/${id}`);
}
