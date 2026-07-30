/**
 * Google Sheet 첫 번째 시트의 참가자 정보를 이름으로 조회합니다.
 *
 * 1행 제목: ID | 이름 | 지역 | 호실 | 룸메이트
 * 룸메이트가 여러 명이면 쉼표(,)로 구분합니다.
 */
const SHEET_NAME = "참가자";

function doGet(e) {
  try {
    const name = normalize_(e && e.parameter ? e.parameter.name : "");
    if (!name) return json_({ ok: false, message: "성함을 입력해 주세요." });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return json_({ ok: false, message: "참가자 시트를 찾을 수 없습니다." });

    const values = sheet.getDataRange().getDisplayValues();
    if (values.length < 2) return json_({ ok: true, guests: [] });

    const headers = values[0].map(normalize_);
    const rows = values.slice(1).filter(row => row.some(Boolean)).map(row => ({
      id: cell_(row, headers, "id") || Utilities.getUuid(),
      name: cell_(row, headers, "이름"),
      region: cell_(row, headers, "지역"),
      room: cell_(row, headers, "호실"),
      roommates: cell_(row, headers, "룸메이트")
        .split(",").map(item => item.trim()).filter(Boolean)
    }));

    const matches = rows.filter(person => normalize_(person.name) === name);
    const guests = matches.map(guest => ({
      id: guest.id,
      name: guest.name,
      region: guest.region,
      room: guest.room,
      roommates: guest.roommates,
      regionGuests: rows
        .filter(person => person.region === guest.region && person.id !== guest.id)
        .map(person => ({ name: person.name, room: person.room }))
    }));

    return json_({ ok: true, guests: guests });
  } catch (error) {
    return json_({ ok: false, message: "조회 중 오류가 발생했습니다." });
  }
}

function cell_(row, headers, title) {
  const index = headers.indexOf(normalize_(title));
  return index >= 0 ? String(row[index] || "").trim() : "";
}

function normalize_(value) {
  return String(value || "").trim().replace(/\s+/g, "").toLowerCase();
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
