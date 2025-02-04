  // useEffect(() => {
  // }, [adminData]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await axiosInstance.get("/admin/check");
  //       if (res.status === 200) {
  //         data=res.data
  //         console.log(data);
  //         setLoading(false);
          
        
  //       } 
  //     } catch (error) {
  //       console.error("Authentication error:", error);
  //       toast.error(error.response?.data?.msg || "authentication failed");
  //       setLoading(false);
      
  //     } finally {
  //       setLoading(false); // Set loading to false after checking
  //     }
  //   };
  //   checkAuth();
  // }, []);