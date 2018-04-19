package main

import (
	_ "bytes"
	_ "fmt"
	_ "io"
	_ "io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

type Stats struct {
	time int
}

// Multiplexer Proxy
type MuxProxy struct {
	urls    []*url.URL
	proxies []*httputil.ReverseProxy
	stats   []Stats
	index   int
	max     int
}

func NewMuxProxy(rawurls []string) *MuxProxy {
	l := len(rawurls)
	urls := make([]*url.URL, l)
	proxies := make([]*httputil.ReverseProxy, l)
	for i, rawurl := range rawurls {
		u, e := url.Parse(rawurl)
		if e != nil {
			log.Fatal(e)
		}
		urls[i] = u
		proxies[i] = httputil.NewSingleHostReverseProxy(u)
	}

	return &MuxProxy{urls, proxies, make([]Stats, l), 0, l}
}

func (p *MuxProxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	proxy := p.Switcher()
	log.Println(r.RemoteAddr, r.Host)
	proxy.ServeHTTP(w, r)
}

func (p *MuxProxy) Traverse(a func(url *url.URL,
	proxy *httputil.ReverseProxy, stat Stats)) {
	for i, u := range p.urls {
		a(u, p.proxies[i], p.stats[i])
	}
}

func (p *MuxProxy) Switcher() *httputil.ReverseProxy {
	p.index += 1
	if p.index == p.max {
		p.index = 0
	}
	//log.Println("Switched to",p.urls[p.index].Host)
	return p.proxies[p.index]
}

func main() {
	//urls := []string{"http://localhost:8081", "http://localhost:8082", "http://localhost:8083"}
	fs := http.FileServer(http.Dir("public"))
	//http.Handle("/", NewMuxProxy(urls))
	//http.Handle("/", fs)
	log.Println("MuxProxy runnning..")
	http.ListenAndServe(":8080", fs)
}
