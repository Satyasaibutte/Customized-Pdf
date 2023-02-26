export const dragApi ={
      create: (data) => {
        return new Promise((resolve, reject) => {
          fetch("http://192.168.50.106:3000/customized_pdfs", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            mode: "no-cors"
          })
            .then((response) => response.json()) 
        });
      },
}