export const dragApi ={
      create: (data) => {
        return new Promise((resolve, reject) => {
          fetch("http://192.168.50.106:3000/customized_pdfs", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            mode: "no-cors"
          })
            .then((response) => response.json()) 
        });
      },
}