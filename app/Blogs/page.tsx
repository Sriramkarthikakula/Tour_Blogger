"use client";
import Link from "next/link";

import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Globe, Plus, User, Pencil, Trash } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import Cookies from "js-cookie";
import { fetchCountries } from "@/utils/supabase/fetchCountries";
import dynamic from "next/dynamic";
// Mock data for posts and user

interface Country {
  country_code: string;
  country_name: string;
}
const Page = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [posts, setPosts] = useState<any[] | []>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [editingPost, setEditingPost] = useState<any>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [isupdateDialogOpen, setIsupdateDialogOpen] = useState(false);
  const [country, setCountry] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const fetchUserDetails = async () => {
    console.log("inside the session");
    const { data: userDetails } = await supabase
      .from("Users_details")
      .select("*")
      .eq("email", email);
    const [userDetail] = userDetails ?? [];
    console.log(userDetails);
    // Set the user and selected country if userDetail exists
    if (userDetail) {
      console.log("Hiii user");
      setUser(userDetail);
      setSelectedCountry(userDetail.country);
    }
  };
  const fetchBlogs = async (value: string) => {
    // Exit if no country is selected

    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("country", value) // Filter by selected country
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
    } else {
      console.log(selectedCountry);
      console.log(blogs);
      setPosts(blogs);
    }
  };
  useEffect(() => {
    const useremail = Cookies.get("email");
    const role = Cookies.get("role");
    const country = Cookies.get("country");
    sessionStorage.setItem("country", country ?? "");
    setEmail(useremail || null);

    setRole(role || null);

    const fetchUserDetails = async () => {
      console.log("inside the session");
      const { data: userDetails } = await supabase
        .from("Users_details")
        .select("*")
        .eq("email", useremail);
      const [userDetail] = userDetails ?? [];
      // Set the user and selected country if userDetail exists
      if (userDetail) {
        console.log(userDetail.country);
        setUser(userDetail);
        setSelectedCountry(userDetail.country);
      }
    };
    const fetchBlogs = async () => {
      let { data } = await supabase
        .from("Users_details")
        .select("country")
        // Filters
        .eq("email", useremail);

      const userCountry = data?.[0]?.country;

      setCountry(userCountry as any);
      // Exit if no country is selected
      const { data: blogs, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("country", userCountry) // Filter by selected country
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setPosts(blogs);
      }
    };

    const getCountries = async () => {
      const data = await fetchCountries();
      setCountries(data);
    };

    fetchUserDetails();
    fetchBlogs();
    getCountries();
  }, []);

  const handleCountryChange = async (value: string) => {
    setSelectedCountry(value);
    sessionStorage.setItem("country", value);
    if (user) {
      await supabase
        .from("Users_details")
        .update({ country: value })
        .eq("email", email);
    }
    fetchUserDetails();
    fetchBlogs(value);
  };

  const handleNewPostSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const country = sessionStorage.getItem("country") || "";
    const newBlogPost = {
      email: user?.email,
      username: user?.username,
      title: newPost.title,
      description: newPost.content,
      country,
      edited: false,
    };
    await supabase.from("blogs").insert(newBlogPost).single();
    setNewPost({ title: "", content: "" });
    fetchBlogs(country);
    setIsDialogOpen(false);
  };

  const handleEditPostSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const country = sessionStorage.getItem("country") || "";
    if (editingPost) {
      console.log(editingPost);
      const updatedPost = { ...editingPost, edited: true };
      await supabase.from("blogs").update(updatedPost).eq("id", editingPost.id);
      setEditingPost(null); // Reset after submission (optional)

      // setIsupdateDialogOpen(false);
      fetchBlogs(country);
    }
  };

  // Handle post delete
  const handleDeletePost = async (id: any) => {
    const country = sessionStorage.getItem("country") || "";
    if (id) {
      await supabase.from("blogs").delete().eq("id", id);
      
      fetchBlogs(country);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col ">
      {/* Navbar */}
      <div className="flex items-center space-x-4 justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Globe className="mr-2 h-4 w-4" />
              {selectedCountry}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Country</DialogTitle>
            </DialogHeader>
            <Select
              onValueChange={handleCountryChange}
              defaultValue={selectedCountry}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem
                    key={country.country_code}
                    value={country.country_name}
                  >
                    <div className="flex items-center">
                      {country.country_code} {country.country_name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <div>{user?.username}</div>
              </div>
              <div>
                <Label>Email</Label>
                <div>{user?.email}</div>
              </div>
              <div>
                <Label>Country</Label>
                <div>{user?.country}</div>
              </div>
              <div>
                <Label>Role</Label>
                <div>{user?.role}</div>
              </div>
              <div>
                <Button
                  asChild
                  size="sm"
                  variant={"default"}
                  disabled
                  className="opacity-75 cursor-none pointer-events-none"
                >
                  <Link href="/sign-up">Your Blogs</Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main content */}
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.length === 0 ? (
            <div className="flex justify-center items-center h-screen">
              <p className="text-lg">No blogs are available</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.username}`}
                      />
                      <AvatarFallback>{post.username} </AvatarFallback>
                    </Avatar>
                    {post.username}
                    {post.edited ? ", admin" : ""}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{post.description}</p>
                </CardContent>
                {user?.role === "admin" && (
                  <CardFooter className="justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingPost(post)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Post</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleEditPostSubmit}
                          className="space-y-4"
                        >
                          <div>
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                              id="edit-title"
                              value={editingPost?.title || ""}
                              onChange={(e) =>
                                setEditingPost((prev: any) =>
                                  prev
                                    ? { ...prev, title: e.target.value }
                                    : prev
                                )
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-content">Content</Label>
                            <Textarea
                              id="edit-content"
                              value={editingPost?.description || ""}
                              onChange={(e) =>
                                setEditingPost(
                                  (prev: any) =>
                                    prev
                                      ? { ...prev, description: e.target.value }
                                      : prev // Corrected field name
                                )
                              }
                              required
                            />
                          </div>
                          <Button type="submit">Update Post</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Post</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this post? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                )}
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button and New Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 rounded-full shadow-lg"
            size="icon"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add new post</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewPostSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="content">Review</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });
