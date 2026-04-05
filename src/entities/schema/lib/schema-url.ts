const SCHEMA_PARAM = "schema";

export function getSchemaIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get(SCHEMA_PARAM);
}

export function setSchemaIdInUrl(schemaId: string | null) {
  const url = new URL(window.location.href);

  if (schemaId) {
    url.searchParams.set(SCHEMA_PARAM, schemaId);
  } else {
    url.searchParams.delete(SCHEMA_PARAM);
  }

  window.history.replaceState({}, "", url);
}
