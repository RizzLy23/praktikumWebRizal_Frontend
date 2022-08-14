const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const urlDatabase = "http://localhost:7000/gaminggear";

        const gaminggear = ref({
            id: null,
            nama: "",
            price: "",
            qty: "",
            listProduk: [],
            errMessage: "",
            isError: false,
            isUpdate: false,
        });

        const getGamingGear = async () => {
            try {
              gaminggear.value.isUpdate = false;
              const resGamingGear = await axios.get(urlDatabase);
              if(resGamingGear.data.length === 0)
              throw new Error("Gaming Gear Tidak Ada!");
              gaminggear.value.listProduk = resGamingGear.data;
              return resGamingGear.data;
            } catch(err) {
              gaminggear.value.isError = true;
              gaminggear.value.errMessage = err.message;
              gaminggear.value.isUpdate = false;
            }
        };

        const getGearById = async (id) => {
            try {
              const resGamingGear = await axios.get(urlDatabase + `/${id}`);
              if (resGamingGear.data.length === 0)
              throw new Error("Gear Tidak Ada(Error getGearByID)");
              
              gaminggear.value.isUpdate = true;
              gaminggear.value.id = id;
              gaminggear.value.nama = resGamingGear.data.nama;
              gaminggear.value.price = resGamingGear.data.price;
              gaminggear.value.qty = resGamingGear.data.qty;
              return resGamingGear.data;
            } catch (err) {
                gaminggear.value.nama = "";
                gaminggear.value.price = "";
                gaminggear.value.qty = "";
                gaminggear.value.isUpdate = false;
                gaminggear.value.isError = true;
                gaminggear.value.errorMessage = err.message;
            }
        };

        const deleteGear = async (id) => {
            try {
              gaminggear.value.isUpdate = false;
              const resGamingGear = await axios.delete(urlDatabase + "/delete", {
                data: {
                  id,
                },
              });
              if (resGamingGear.data.length === 0)
                throw new Error("Gear Tidak Ada(error delete)");
              gaminggear.value.listProduk = resGamingGear.data;
              await getGamingGear();
              return resGamingGear.data;
            } catch (err) {
              gaminggear.value.isError = true;
              gaminggear.value.errorMessage = err.message;
            }
        };

        const submitGear = async () => {
            try {
              gaminggear.value.isUpdate = false;
              const post = await axios.post(urlDatabase + "/create", {
                nama: gaminggear.value.nama,
                price: gaminggear.value.price,
                qty: gaminggear.value.qty,
              });
              gaminggear.value.isError = false;
              gaminggear.value.nama = "";
              gaminggear.value.price = "";
              gaminggear.value.qty = "";
              gaminggear.value.isUpdate = false;
              if (!post) throw new Error("Gagal Submit Gaming Gear!");
              await getGamingGear();
            } catch (err) {
              gaminggear.value.isError = true;
              gaminggear.value.errorMessage = err.message;
            }
        };

        const updateGear = async () => {
          try {
            gaminggear.value.isUpdate = true;
            const put = await axios.put(urlDatabase + "/update", {
              id: gaminggear.value.id,
              nama: gaminggear.value.nama,
              price: gaminggear.value.price,
              qty: gaminggear.value.qty,
            });
            gaminggear.value.isError = false;
            gaminggear.value.nama = "";
            gaminggear.value.price = "";
            gaminggear.value.qty = "";
            gaminggear.value.isUpdate = false;
            gaminggear.value.isError = true;
            if (!put) throw new Error("Gagal mengupdate Gear");
            await getGamingGear();
          } catch (err) {
            gaminggear.value.isUpdate = false;
            gaminggear.value.isError = true;
            gaminggear.value.errorMessage = err.message;
          }
        };

        onMounted(async () => {
            await getGamingGear();
        });

        return {
            gaminggear,
            getGearById,
            submitGear,
            updateGear,
            deleteGear,
        };
    },
});

app.mount("#app");