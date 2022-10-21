import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminOnlyLink } from "../adminRoute/AdminRoute";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// firebase
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { setActiveUser, removeActiveUser } from "../../redux/slice/authSlice";

const Navbar = () => {
	const { isUserLoggedIn, userName } = useSelector((store) => store.auth);

	const [displayName, setDisplayName] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//* Monitor currently signed USER
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				if (displayName == null) {
					setDisplayName(user.email.split("@")[0]);
				}
				dispatch(
					setActiveUser({
						email: user.email,
						userName: user.displayName ? user.displayName : displayName,
						userId: user.uid,
					})
				);
			} else {
				setDisplayName("");
				dispatch(removeActiveUser());
			}
		});
	}, []);

	function logOutUser() {
		signOut(auth)
			.then(() => {
				toast.success("User Signed Out ");
				navigate("/");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				toast.error(errorCode, errorMessage);
			});
	}

	return (
		<>
			<nav className="h-[8vh] bg-neutral shadow-xl  flex items-center ">
				<div className="navbar w-full md:w-9/12 mx-auto flex items-center justify-between">
					<section className="w-full md:gap-4">
						<Link to="/" className="btn btn-ghost ">
							<h1 className="logo text-white text-lg md:text-3xl ">E-Shop.com</h1>
						</Link>
					</section>

					<div className="md:gap-2">
						<div className="dropdown dropdown-end ">
							<label tabIndex={0} className="btn btn-ghost btn-circle">
								<div className="indicator">
									<AiOutlineShoppingCart size={30} color="white" />
									<span className="badge badge-secondary-content indicator-item">
										8
									</span>
								</div>
							</label>
							<div
								tabIndex={0}
								className="mt-3 card card-compact dropdown-content w-52 bg-base-100  shadow-xl "
							>
								<div className="card-body">
									<span className="font-bold text-lg">8 Items</span>
									<span className="text-info">Subtotal: $999</span>
									<div className="card-actions">
										<Link to="/cart" className="btn btn-primary btn-block">
											View cart
										</Link>
									</div>
								</div>
							</div>
						</div>
						<div className="dropdown dropdown-end ml-4">
							<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
								<div className="w-10 rounded-full">
									<img src="https://placeimg.com/80/80/people" alt="dp" />
								</div>
							</label>
							<ul
								tabIndex={0}
								className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 "
							>
								{userName && (
									<li className="bg-blue-700 text-gray-200">
										<p className="block">
											Welcome, <span className="font-bold">{userName}</span>
										</p>
									</li>
								)}

								{isUserLoggedIn ? (
									<div>
										<li>
											<Link to="/my-orders" className="text-lg">
												My Orders
											</Link>
										</li>
										<li>
											<Link
												to="/"
												className="flex justify-between hover:bg-red-100  text-red-500 text-lg"
												onClick={logOutUser}
											>
												LOGOUT
											</Link>
										</li>
									</div>
								) : (
									<li>
										<label htmlFor="my-modal-4" className="modal-button">
											Login / Register
										</label>
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			</nav>
			<AdminOnlyLink>
				<div className="min-w-screen h-10  py-1 bg-red-200 text-red-700 font-bold text-center cursor-pointer">
					<span>ADMIN</span>

					<Link to="/admin/home" className="btn btn-primary btn-sm mx-4">
						VIEW DASHBOARD
					</Link>
				</div>
			</AdminOnlyLink>
		</>
	);
};

export default Navbar;
