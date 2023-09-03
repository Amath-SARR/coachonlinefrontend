export default async function (response, options = {}) {
  const {
    blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileType = 'xlsx',
    fileName,
  } = options;
  const data = await response.blob();
  const pom = document.createElement('a');
  const blob = new Blob([data], {
    type: blobType,
  });
  const url = URL.createObjectURL(blob);
  const dateNow = new Date();
  pom.href = url;
  pom.setAttribute('download', `${fileName || dateNow.toISOString()}.${fileType}`);
  pom.click();
}
